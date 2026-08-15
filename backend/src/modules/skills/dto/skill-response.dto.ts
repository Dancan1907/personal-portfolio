// ============================================
// SKILL RESPONSE DTO - API Response Format
// ============================================
// This DTO ensures consistent response structure

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SkillResponseDto {
  @ApiProperty({
    description: "Unique skill ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  id?: string;

  @ApiProperty({
    description: "Skill category",
    example: "Frontend",
  })
  category?: string;

  @ApiProperty({
    description: "Skill name",
    example: "React",
  })
  name?: string;

  @ApiPropertyOptional({
    description: "Lucide icon name or URL to icon image",
    example: "React",
  })
  icon?: string;

  @ApiPropertyOptional({
    description: "Proficiency level (1-100)",
    example: 90,
  })
  proficiency?: number;

  @ApiPropertyOptional({
    description: "Display order",
    example: 0,
  })
  order?: number;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2026-08-09T16:31:40.000Z",
  })
  createdAt?: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2026-08-09T16:31:40.000Z",
  })
  updatedAt?: Date;
}
