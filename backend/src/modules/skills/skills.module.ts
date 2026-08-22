// ============================================
// SKILLS MODULE - Registration
// ============================================
// This module manages technical skills for the portfolio
// It provides endpoints for public viewing and admin CRUD

import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt"; // ← ADD THIS
import { SkillsController } from "./skills.controller";
import { SkillsService } from "./skills.service";

@Module({
  imports: [
    // ✅ ADD THIS BLOCK
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
  ],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService],
})
export class SkillsModule {}
