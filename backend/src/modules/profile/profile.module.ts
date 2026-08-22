// ============================================
// PROFILE MODULE - Registration
// ============================================
// This module manages user profiles (professional information)
// It provides endpoints for creating, reading, and updating profiles

import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt"; // ← ADD THIS
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";

@Module({
  imports: [
    // ✅ ADD THIS BLOCK
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "15m" },
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
