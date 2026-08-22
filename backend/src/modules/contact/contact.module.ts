// ============================================
// CONTACT MODULE - Registration
// ============================================
// This module manages contact form messages
// It provides public endpoint for submitting messages
// and admin endpoints for managing them

import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt"; // ← ADD THIS
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";
import { EmailModule } from "../email/email.module"; // ← KEEP THIS

@Module({
  imports: [
    // ✅ ADD THIS BLOCK
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
    EmailModule, // ← KEEP THIS
  ],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
