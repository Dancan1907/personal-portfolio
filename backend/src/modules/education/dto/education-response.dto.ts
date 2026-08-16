// ============================================
// EDUCATION RESPONSE DTO - API Response Format
// ============================================
// This DTO ensures consistent response structure
// Includes all education fields and metadata

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EducationResponseDto {
  @ApiProperty({
    description: "Unique education ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  id?: string;

  @ApiProperty({
    description: "Institution name",
    example: "University of Eldoret",
  })
  institution?: string;

  @ApiProperty({
    description: "Degree name",
    example: "Bachelor of Science in Computer Science",
  })
  degree?: string;

  @ApiPropertyOptional({
    description: "Field of study",
    example: "Computer Science",
  })
  field?: string;

  @ApiPropertyOptional({
    description: "Location",
    example: "Nairobi, Kenya",
  })
  location?: string;

  @ApiProperty({
    description: "Start date",
    example: "2016-09-01T00:00:00.000Z",
  })
  startDate?: Date;

  @ApiPropertyOptional({
    description: "End date",
    example: "2020-06-01T00:00:00.000Z",
  })
  endDate?: Date;

  @ApiProperty({
    description: "Whether you are currently studying here",
    example: false,
  })
  isPresent?: boolean;

  @ApiPropertyOptional({
    description: "Description of the education",
    example: "Focused on software engineering and algorithms.",
  })
  description?: string;

  @ApiPropertyOptional({
    description: "Array of relevant coursework",
    example: ["Data Structures", "Algorithms", "Database Design"],
    type: [String],
  })
  coursework?: string[];

  @ApiPropertyOptional({
    description: "Array of academic achievements",
    example: ["Dean's List", "Top 10% of class"],
    type: [String],
  })
  achievements?: string[];

  @ApiPropertyOptional({
    description: "GPA or grade",
    example: "3.8",
  })
  gpa?: string;

  @ApiPropertyOptional({
    description: "Display order",
    example: 1,
  })
  order?: number;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2026-08-16T03:00:00.000Z",
  })
  createdAt?: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2026-08-16T03:00:00.000Z",
  })
  updatedAt?: Date;
}
