// NestJS core decorators and exceptions
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
// JwtService for signing tokens
import { JwtService } from "@nestjs/jwt";
// Prisma service to interact with database
import { PrismaService } from "../prisma/prisma.service";
// bcrypt for password hashing and verification (more stable on Render)
import * as bcrypt from "bcrypt"; // ← REPLACE argon2 with bcrypt
// DTOs
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
// Prisma types (User, Role)
import { User, Role } from "@prisma/client";
// Pino logger for structured logging of critical auth events
import { Logger } from "nestjs-pino";
// EmailService to send verification emails
import { EmailService } from "../email/email.service";
// randomBytes to generate a secure verification token
import { randomBytes } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly logger: Logger,
    private readonly emailService: EmailService,
  ) {}

  // ---------- REGISTER ----------
  async register(dto: RegisterDto) {
    this.logger.log(`Registration attempt for email: ${dto.email}`);

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      this.logger.warn(
        `Registration failed: email ${dto.email} already exists`,
      );
      throw new ConflictException("Email already registered");
    }

    // ✅ REPLACE argon2.hash() with bcrypt.hash()
    const hashedPassword = await bcrypt.hash(dto.password!, 10);

    const verificationToken = randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email!,
        password: hashedPassword,
        name: dto.name,
        role: Role.USER,
        isActive: true,
        emailVerified: false,
        verificationToken: verificationToken,
        verificationTokenExpiry: verificationTokenExpiry,
      },
    });

    this.emailService
      .sendVerificationEmail(dto.email!, dto.name!, verificationToken)
      .catch((error) => {
        this.logger.error(
          { error },
          `Failed to send verification email to ${dto.email}`,
        );
      });

    this.logger.log(`User registered: ${user.email} (ID: ${user.id})`);

    const {
      password: _password,
      refreshToken: _refreshToken,
      verificationToken: _vToken,
      verificationTokenExpiry: _vExpiry,
      ...result
    } = user;

    return {
      user: result,
      message:
        "Registration successful. Please check your email to verify your account.",
    };
  }

  // ---------- VERIFY EMAIL ----------
  async verifyEmail(token: string) {
    this.logger.log(
      `Email verification attempt with token: ${token.substring(0, 8)}...`,
    );

    const user = await this.prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      this.logger.warn(`Email verification failed: invalid or expired token`);
      throw new BadRequestException("Invalid or expired verification token");
    }

    if (user.emailVerified) {
      this.logger.warn(
        `Email verification attempt for already verified user: ${user.email}`,
      );
      throw new BadRequestException("Email already verified");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    this.logger.log(`Email verified successfully: ${user.email}`);
    return { message: "Email verified successfully. You can now log in." };
  }

  // ---------- LOGIN ----------
  async login(dto: LoginDto) {
    this.logger.log(`Login attempt for email: ${dto.email}`);

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      this.logger.warn(`Login failed: email ${dto.email} not found`);
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.emailVerified) {
      this.logger.warn(`Login failed: email ${dto.email} not verified`);
      throw new UnauthorizedException(
        "Please verify your email before logging in",
      );
    }

    if (!user.isActive) {
      this.logger.warn(`Login failed: account ${dto.email} is disabled`);
      throw new UnauthorizedException("Account is disabled");
    }

    // ✅ REPLACE argon2.verify() with bcrypt.compare()
    const isValid = await bcrypt.compare(dto.password!, user.password);
    if (!isValid) {
      this.logger.warn(`Login failed: invalid password for ${dto.email}`);
      throw new UnauthorizedException("Invalid credentials");
    }

    // 2FA CHECK
    if (user.isTwoFactorEnabled) {
      const tempToken = this.jwtService.sign(
        { sub: user.id, email: user.email, scope: "2fa" },
        { secret: process.env.JWT_SECRET, expiresIn: "5m" },
      );

      this.logger.log(`2FA required for user ${user.email}`);

      return {
        twoFactorRequired: true,
        tempToken,
        message: "Two-factor authentication required.",
      };
    }

    const tokens = await this.generateTokens(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refresh_token },
    });

    this.logger.log(`User logged in: ${user.email} (ID: ${user.id})`);

    const {
      password: _password,
      refreshToken: _refreshToken,
      ...result
    } = user;

    return {
      user: result,
      ...tokens,
    };
  }

  // ---------- REFRESH TOKEN ----------
  async refreshTokens(userId: string, refreshToken: string) {
    this.logger.log(`Refresh token attempt for user ID: ${userId}`);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      this.logger.warn(
        `Refresh failed: no valid refresh token for user ${userId}`,
      );
      throw new UnauthorizedException("Invalid refresh token");
    }

    if (user.refreshToken !== refreshToken) {
      this.logger.warn(
        `Refresh failed: refresh token mismatch for user ${userId}`,
      );
      throw new UnauthorizedException("Invalid refresh token");
    }

    const tokens = await this.generateTokens(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refresh_token },
    });

    this.logger.log(`Refresh successful for user ${userId}`);
    return tokens;
  }

  // ---------- LOGOUT ----------
  async logout(userId: string) {
    this.logger.log(`Logout for user ID: ${userId}`);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    this.logger.log(`User ${userId} logged out successfully`);
    return { success: true };
  }

  // ---------- REQUEST PASSWORD RESET ----------
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    this.logger.log(`Password reset requested for email: ${email}`);

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      this.logger.warn(
        `Password reset requested for non-existent email: ${email}`,
      );
      return {
        message:
          "If an account exists with this email, you will receive a password reset link.",
      };
    }

    if (!user.isActive) {
      this.logger.warn(
        `Password reset requested for inactive account: ${email}`,
      );
      throw new BadRequestException(
        "Account is disabled. Please contact support.",
      );
    }

    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    this.emailService
      .sendPasswordResetEmail(email, user.name, resetToken)
      .catch((error) => {
        this.logger.error(
          { error },
          `Failed to send password reset email to ${email}`,
        );
      });

    this.logger.log(`Password reset token generated for: ${email}`);
    return {
      message:
        "If an account exists with this email, you will receive a password reset link.",
    };
  }

  // ---------- RESET PASSWORD ----------
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    this.logger.log(
      `Password reset attempt with token: ${token.substring(0, 8)}...`,
    );

    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      this.logger.warn(`Password reset failed: invalid or expired token`);
      throw new BadRequestException("Invalid or expired reset token");
    }

    if (!user.isActive) {
      this.logger.warn(
        `Password reset attempted for inactive account: ${user.email}`,
      );
      throw new BadRequestException(
        "Account is disabled. Please contact support.",
      );
    }

    // ✅ REPLACE argon2.hash() with bcrypt.hash()
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    this.logger.log(`Password reset successful for: ${user.email}`);
    return {
      message:
        "Password reset successfully. You can now login with your new password.",
    };
  }

  // ---------- VALIDATE USER ----------
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      this.logger.warn(`Validation failed: user ${email} not found`);
      return null;
    }

    // ✅ REPLACE argon2.verify() with bcrypt.compare()
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      this.logger.warn(`Validation failed: password mismatch for ${email}`);
      return null;
    }

    const { password: _password, ...result } = user;
    return result;
  }

  // ---------- PRIVATE: GENERATE TOKENS ----------
  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: "15m",
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: "7d",
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 900,
    };
  }
}
