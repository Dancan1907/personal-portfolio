// backend/src/modules/auth/auth.module.ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { RefreshStrategy } from "./strategies/refresh.strategy";
import { PrismaModule } from "../prisma/prisma.module";
import { EmailModule } from "../email/email.module";
import { TwoFactorController } from "./two-factor.controller";
import { TwoFactorService } from "./two-factor.service";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
    PrismaModule,
    EmailModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    RefreshStrategy,
    TwoFactorService,
  ],
  controllers: [AuthController, TwoFactorController],
  exports: [AuthService],
})
export class AuthModule {}
