// ============================================
// CREATE EDUCATION DTO - Data Transfer Object
// ============================================
// This DTO validates the data sent to POST /api/v1/education
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

export class CreateEducationDto {
  // ===== REQUIRED FIELDS =====

  @ApiProperty({
    description: "Institution name (School/University)",
    example: "University of Eldoret",
    required: true,
  })
  @IsNotEmpty({ message: "Institution is required" })
  @IsString()
  institution?: string;

  @ApiProperty({
    description: "Degree name",
    example: "Bachelor of Science in Computer Science",
    required: true,
  })
  @IsNotEmpty({ message: "Degree is required" })
  @IsString()
  degree?: string;

  @ApiProperty({
    description: "Start date (ISO format)",
    example: "2016-09-01",
    required: true,
  })
  @IsNotEmpty({ message: "Start date is required" })
  @IsDateString({}, { message: "Start date must be a valid ISO date" })
  startDate?: string;

  // ===== OPTIONAL FIELDS =====

  @ApiPropertyOptional({
    description: "Field of study",
    example: "Computer Science",
  })
  @IsOptional()
  @IsString()
  field?: string;

  @ApiPropertyOptional({
    description: "Location (City, Country)",
    example: "Nairobi, Kenya",
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: "End date (ISO format) - omit if currently studying",
    example: "2020-06-01",
  })
  @IsOptional()
  @IsDateString({}, { message: "End date must be a valid ISO date" })
  endDate?: string;

  @ApiPropertyOptional({
    description: "Whether you are currently studying here",
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPresent?: boolean;

  @ApiPropertyOptional({
    description: "Description of the education",
    example: "Focused on software engineering and algorithms.",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: "Array of relevant coursework",
    example: ["Data Structures", "Algorithms", "Database Design"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  coursework?: string[];

  @ApiPropertyOptional({
    description: "Array of academic achievements",
    example: ["Dean's List", "Top 10% of class"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];

  @ApiPropertyOptional({
    description: "GPA or grade",
    example: "3.8",
  })
  @IsOptional()
  @IsString()
  gpa?: string;

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
