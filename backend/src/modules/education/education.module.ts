// ============================================
// EDUCATION MODULE - Registration
// ============================================
// This module manages education history entries for the portfolio
// It provides endpoints for public viewing and admin CRUD

import { Module } from "@nestjs/common";
import { EducationController } from "./education.controller";
import { EducationService } from "./education.service";

@Module({
  controllers: [EducationController], // Register the controller
  providers: [EducationService], // Register the service
  exports: [EducationService], // Make service available to other modules
})
export class EducationModule {}
