// ============================================
// CREATE EXPERIENCE DTO - Data Transfer Object
// ============================================
// This DTO validates the data sent to POST /api/v1/experience
// All fields are validated using class-validator decorators

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsDateString,
  IsBoolean,
  IsInt,
  Min,
} from "class-validator";

export class CreateExperienceDto {
  // ===== REQUIRED FIELDS =====

  @ApiProperty({
    description: "Job title / Role",
    example: "Senior Full Stack Developer",
    required: true,
  })
  @IsNotEmpty({ message: "Role is required" })
  @IsString()
  role?: string;

  @ApiProperty({
    description: "Company or organization name",
    example: "Tech Corp",
    required: true,
  })
  @IsNotEmpty({ message: "Organization is required" })
  @IsString()
  organization?: string;

  @ApiProperty({
    description: "Start date (ISO format)",
    example: "2022-01-01",
    required: true,
  })
  @IsNotEmpty({ message: "Start date is required" })
  @IsDateString({}, { message: "Start date must be a valid ISO date" })
  startDate?: string;

  // ===== OPTIONAL FIELDS =====

  @ApiPropertyOptional({
    description: "Location (City, Country)",
    example: "Nairobi, Kenya",
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: "End date (ISO format) - omit if currently working here",
    example: "2024-12-31",
  })
  @IsOptional()
  @IsDateString({}, { message: "End date must be a valid ISO date" })
  endDate?: string;

  @ApiPropertyOptional({
    description: "Whether this is your current position",
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPresent?: boolean;

  @ApiPropertyOptional({
    description: "Description of the role",
    example: "Building scalable web applications with modern technologies.",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: "Array of responsibilities",
    example: [
      "Architected microservices using NestJS",
      "Led frontend development with Next.js",
    ],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  responsibilities?: string[];

  @ApiPropertyOptional({
    description: "Array of technologies used",
    example: ["React", "Node.js", "TypeScript", "AWS"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];

  @ApiPropertyOptional({
    description: "Key achievements",
    example: ["Reduced load time by 40%", "Scaled to 10,000 concurrent users"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];

  @ApiPropertyOptional({
    description: "Display order (lower numbers appear first)",
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
