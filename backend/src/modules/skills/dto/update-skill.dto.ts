// ============================================
// UPDATE SKILL DTO - Data Transfer Object
// ============================================
// This DTO validates partial updates to a skill
// All fields are optional - only provided fields will be updated

import { PartialType } from "@nestjs/swagger";
import { CreateSkillDto } from "./create-skill.dto";

// PartialType makes all fields optional
// Perfect for PATCH/PUT operations
export class UpdateSkillDto extends PartialType(CreateSkillDto) {}
