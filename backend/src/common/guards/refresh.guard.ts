// backend/src/common/guards/refresh.guard.ts
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../modules/prisma/prisma.service";

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.body?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token required");
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          refreshToken: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      if (!user.isActive) {
        throw new UnauthorizedException("Account is disabled");
      }

      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      request.user = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        refreshToken: refreshToken,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
