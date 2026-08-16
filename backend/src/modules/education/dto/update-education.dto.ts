// ============================================
// UPDATE EDUCATION DTO - Data Transfer Object
// ============================================
// This DTO validates partial updates to an education entry
// All fields are optional - only provided fields will be updated

import { PartialType } from "@nestjs/swagger";
import { CreateEducationDto } from "./create-education.dto";

// PartialType makes all fields optional
// Perfect for PATCH/PUT operations
export class UpdateEducationDto extends PartialType(CreateEducationDto) {}
