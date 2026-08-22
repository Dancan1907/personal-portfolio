// ============================================
// JWT STRATEGY - Passport JWT Authentication
// ============================================
// This strategy validates JWT tokens and extracts user information.
// The validate() method is called after the token is verified.

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    // ✅ PassportStrategy calls super with configuration
    super({
      // Extract JWT from the Authorization header as Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Reject expired tokens
      ignoreExpiration: false,
      // Secret key for verifying the token
      secretOrKey: process.env.JWT_SECRET! as string,
    });
  }

  /**
   * validate() is called after the token is verified
   * The 'payload' is the decoded JWT payload (sub, email, role, etc.)
   *
   * @param payload - Decoded JWT payload
   * @returns User object to be attached to request.user
   * @throws UnauthorizedException if user is not found or inactive
   */
  async validate(payload: any) {
    // ✅ Inject PrismaService to verify user exists in database
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        emailVerified: true,
      },
    });

    // ✅ Check if user exists
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // ✅ Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException("Account is disabled");
    }

    // ✅ Return the user data to be attached to request.user
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
