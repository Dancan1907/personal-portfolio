// ============================================
// EXPERIENCE RESPONSE DTO - API Response Format
// ============================================
// This DTO ensures consistent response structure
// Includes all experience fields and metadata

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ExperienceResponseDto {
  @ApiProperty({
    description: "Unique experience ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  id?: string;

  @ApiProperty({
    description: "Job title / Role",
    example: "Senior Full Stack Developer",
  })
  role?: string;

  @ApiProperty({
    description: "Company or organization name",
    example: "Tech Corp",
  })
  organization?: string;

  @ApiPropertyOptional({
    description: "Location (City, Country)",
    example: "Nairobi, Kenya",
  })
  location?: string;

  @ApiProperty({
    description: "Start date",
    example: "2022-01-01T00:00:00.000Z",
  })
  startDate?: Date;

  @ApiPropertyOptional({
    description: "End date",
    example: "2024-12-31T00:00:00.000Z",
  })
  endDate?: Date;

  @ApiProperty({
    description: "Whether this is the current position",
    example: false,
  })
  isPresent?: boolean;

  @ApiPropertyOptional({
    description: "Description of the role",
    example: "Building scalable web applications with modern technologies.",
  })
  description?: string;

  @ApiPropertyOptional({
    description: "Array of responsibilities",
    example: [
      "Architected microservices using NestJS",
      "Led frontend development with Next.js",
    ],
    type: [String],
  })
  responsibilities?: string[];

  @ApiPropertyOptional({
    description: "Array of technologies used",
    example: ["React", "Node.js", "TypeScript", "AWS"],
    type: [String],
  })
  technologies?: string[];

  @ApiPropertyOptional({
    description: "Key achievements",
    example: ["Reduced load time by 40%", "Scaled to 10,000 concurrent users"],
    type: [String],
  })
  achievements?: string[];

  @ApiPropertyOptional({
    description: "Display order",
    example: 1,
  })
  order?: number;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2026-08-16T02:47:00.000Z",
  })
  createdAt?: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2026-08-16T02:47:00.000Z",
  })
  updatedAt?: Date;
}
