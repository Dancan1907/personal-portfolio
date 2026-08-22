// ============================================
// REFRESH STRATEGY - Passport JWT Refresh
// ============================================
// This strategy validates refresh tokens for token rotation.
// The validate() method is called after the token is verified.

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(private prisma: PrismaService) {
    // ✅ PassportStrategy calls super with configuration
    super({
      // Extract refresh token from the request body field 'refresh_token'
      jwtFromRequest: ExtractJwt.fromBodyField("refresh_token"),
      // Reject expired tokens
      ignoreExpiration: false,
      // Use the refresh secret for verification
      secretOrKey: process.env.JWT_REFRESH_SECRET! as string,
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
        refreshToken: true,
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
    // The refresh token validation (comparing to DB) will be done in the guard
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
