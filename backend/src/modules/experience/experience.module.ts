// ============================================
// EXPERIENCE MODULE - Registration
// ============================================
// This module manages work experience entries for the portfolio
// It provides endpoints for public viewing and admin CRUD

import { Module } from "@nestjs/common";
import { ExperienceController } from "./experience.controller";
import { ExperienceService } from "./experience.service";

@Module({
  controllers: [ExperienceController], // Register the controller
  providers: [ExperienceService], // Register the service
  exports: [ExperienceService], // Make service available to other modules
})
export class ExperienceModule {}
