// ============================================
// UPDATE PROFILE DTO - Data Transfer Object
// ============================================
// This DTO validates partial updates to a profile
// All fields are optional - only provided fields will be updated

import { PartialType } from "@nestjs/swagger";
import { CreateProfileDto } from "./create-profile.dto";

// PartialType makes all fields optional
// This is perfect for PATCH/PUT operations
export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
