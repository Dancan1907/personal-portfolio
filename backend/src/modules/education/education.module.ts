// ============================================
// EDUCATION MODULE - Registration
// ============================================
// This module manages education history entries for the portfolio
// It provides endpoints for public viewing and admin CRUD

import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt"; // ← ADD THIS
import { EducationController } from "./education.controller";
import { EducationService } from "./education.service";

@Module({
  imports: [
    // ✅ ADD THIS BLOCK
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
  ],
  controllers: [EducationController],
  providers: [EducationService],
  exports: [EducationService],
})
export class EducationModule {}
