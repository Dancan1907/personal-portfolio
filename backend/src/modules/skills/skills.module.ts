// ============================================
// SKILLS MODULE - Registration
// ============================================
// This module manages technical skills for the portfolio
// It provides endpoints for public viewing and admin CRUD

import { Module } from "@nestjs/common";
import { SkillsController } from "./skills.controller";
import { SkillsService } from "./skills.service";

@Module({
  controllers: [SkillsController], // Register the controller
  providers: [SkillsService], // Register the service
  exports: [SkillsService], // Make service available to other modules
})
export class SkillsModule {}
