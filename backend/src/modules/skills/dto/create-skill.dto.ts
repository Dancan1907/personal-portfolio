// ============================================
// CREATE SKILL DTO - Data Transfer Object
// ============================================
// This DTO validates the data sent to POST /api/v1/skills
// All fields are required except icon and proficiency

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
} from "class-validator";

export class CreateSkillDto {
  @ApiProperty({
    description: "Skill category (e.g., Frontend, Backend, DevOps)",
    example: "Frontend",
    required: true,
  })
  @IsNotEmpty({ message: "Category is required" })
  @IsString()
  category?: string;

  @ApiProperty({
    description: "Skill name (e.g., React, Node.js, Docker)",
    example: "React",
    required: true,
  })
  @IsNotEmpty({ message: "Name is required" })
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: "Lucide icon name or URL to icon image",
    example: "React",
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: "Proficiency level (1-100)",
    example: 90,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  proficiency?: number;

  @ApiPropertyOptional({
    description: "Display order (lower numbers appear first)",
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  order?: number;
}
