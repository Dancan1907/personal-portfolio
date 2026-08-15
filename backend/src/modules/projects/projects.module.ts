// ============================================
// PROJECTS MODULE - Registration
// ============================================
// This module manages portfolio projects
// It provides endpoints for public viewing and admin CRUD

import { Module } from "@nestjs/common";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";

@Module({
  controllers: [ProjectsController], // Register the controller
  providers: [ProjectsService], // Register the service
  exports: [ProjectsService], // Make service available to other modules
})
export class ProjectsModule {}
