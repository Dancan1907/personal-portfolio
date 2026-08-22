// ============================================
// EXPERIENCE MODULE - Registration
// ============================================
// This module manages work experience entries for the portfolio
// It provides endpoints for public viewing and admin CRUD

import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt"; // ← ADD THIS
import { ExperienceController } from "./experience.controller";
import { ExperienceService } from "./experience.service";

@Module({
  imports: [
    // ✅ ADD THIS BLOCK
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
  ],
  controllers: [ExperienceController],
  providers: [ExperienceService],
  exports: [ExperienceService],
})
export class ExperienceModule {}
