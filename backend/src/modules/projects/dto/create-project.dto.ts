// ============================================
// CREATE PROJECT DTO - Data Transfer Object
// ============================================
// This DTO validates the data sent to POST /api/v1/projects
// All fields are validated using class-validator decorators

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsBoolean,
  IsArray,
  IsSlug,
} from "class-validator";

export class CreateProjectDto {
  // ===== REQUIRED FIELDS =====

  @ApiProperty({
    description: "Project title",
    example: "Portfolio Website",
    required: true,
  })
  @IsNotEmpty({ message: "Title is required" })
  @IsString()
  title: string;

  @ApiProperty({
    description:
      "URL-friendly slug (auto-generated from title if not provided)",
    example: "portfolio-website",
    required: false,
  })
  @IsOptional()
  @IsSlug({ message: "Slug must be a valid URL slug" })
  @IsString()
  slug?: string;

  // ===== OPTIONAL FIELDS =====

  @ApiPropertyOptional({
    description: "Brief project description",
    example: "A modern portfolio built with Next.js and NestJS",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: "Problem the project solves",
    example: "Need a professional portfolio to showcase my work",
  })
  @IsOptional()
  @IsString()
  problem?: string;

  @ApiPropertyOptional({
    description: "How the problem was solved",
    example: "Built a full-stack portfolio management system",
  })
  @IsOptional()
  @IsString()
  solution?: string;

  @ApiPropertyOptional({
    description: "Challenges faced during development",
    example: "Balancing design aesthetics with performance",
  })
  @IsOptional()
  @IsString()
  challenge?: string;

  @ApiPropertyOptional({
    description: "Lessons learned from the project",
    example: "Learned to build a production-ready monorepo",
  })
  @IsOptional()
  @IsString()
  lessons?: string;

  @ApiPropertyOptional({
    description: "Technologies used (array of strings)",
    example: ["Next.js", "NestJS", "PostgreSQL", "Prisma"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @ApiPropertyOptional({
    description: "Key features (array of strings)",
    example: ["Dark Mode", "Animations", "Admin Dashboard"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({
    description: "Live demo URL",
    example: "https://your-portfolio.com",
  })
  @IsOptional()
  @IsUrl({}, { message: "Demo URL must be a valid URL" })
  demoUrl?: string;

  @ApiPropertyOptional({
    description: "GitHub repository URL",
    example: "https://github.com/yourusername/portfolio",
  })
  @IsOptional()
  @IsUrl({}, { message: "GitHub URL must be a valid URL" })
  githubUrl?: string;

  @ApiPropertyOptional({
    description: "Whether this project should be featured on the homepage",
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: "Whether this project is published/visible",
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
