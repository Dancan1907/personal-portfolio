// ============================================
// PROFILE MODULE - Registration
// ============================================
// This module manages user profiles (professional information)
// It provides endpoints for creating, reading, and updating profiles

import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";

@Module({
  // We don't import PrismaModule here because it's already global
  // We'll inject PrismaService directly in ProfileService
  controllers: [ProfileController], // Register the controller
  providers: [ProfileService], // Register the service
  exports: [ProfileService], // Make service available to other modules
})
export class ProfileModule {}
