// ============================================
// CONTACT MODULE - Registration
// ============================================
// This module manages contact form messages
// It provides public endpoint for submitting messages
// and admin endpoints for managing them

import { Module } from "@nestjs/common";
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";

@Module({
  controllers: [ContactController], // Register the controller
  providers: [ContactService], // Register the service
  exports: [ContactService], // Make service available to other modules
})
export class ContactModule {}
