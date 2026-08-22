// backend/src/modules/auth/auth.module.ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { EmailModule } from "../email/email.module";
import { TwoFactorController } from "./two-factor.controller";
import { TwoFactorService } from "./two-factor.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
    PrismaModule,
    EmailModule,
  ],
  providers: [AuthService, TwoFactorService],
  controllers: [AuthController, TwoFactorController],
  exports: [AuthService],
})
export class AuthModule {}
