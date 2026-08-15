// ============================================
// UPDATE PROJECT DTO - Data Transfer Object
// ============================================
// This DTO validates partial updates to a project
// All fields are optional - only provided fields will be updated

import { PartialType } from "@nestjs/swagger";
import { CreateProjectDto } from "./create-project.dto";

// PartialType makes all fields optional
// Perfect for PATCH/PUT operations
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
