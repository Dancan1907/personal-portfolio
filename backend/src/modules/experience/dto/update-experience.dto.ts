// ============================================
// UPDATE EXPERIENCE DTO - Data Transfer Object
// ============================================
// This DTO validates partial updates to an experience entry
// All fields are optional - only provided fields will be updated

import { PartialType } from "@nestjs/swagger";
import { CreateExperienceDto } from "./create-experience.dto";

// PartialType makes all fields optional
// Perfect for PATCH/PUT operations
export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}
