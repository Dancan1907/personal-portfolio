// ============================================
// PROJECT RESPONSE DTO - API Response Format
// ============================================
// This DTO ensures consistent response structure
// Includes all project fields and metadata

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ProjectResponseDto {
  @ApiProperty({
    description: "Unique project ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  id?: string;

  @ApiProperty({
    description: "Project title",
    example: "Portfolio Website",
  })
  title?: string;

  @ApiProperty({
    description: "URL-friendly slug",
    example: "portfolio-website",
  })
  slug?: string;

  @ApiPropertyOptional({
    description: "Brief project description",
    example: "A modern portfolio built with Next.js and NestJS",
  })
  description?: string;

  @ApiPropertyOptional({
    description: "Problem the project solves",
    example: "Need a professional portfolio to showcase my work",
  })
  problem?: string;

  @ApiPropertyOptional({
    description: "How the problem was solved",
    example: "Built a full-stack portfolio management system",
  })
  solution?: string;

  @ApiPropertyOptional({
    description: "Challenges faced during development",
    example: "Balancing design aesthetics with performance",
  })
  challenge?: string;

  @ApiPropertyOptional({
    description: "Lessons learned from the project",
    example: "Learned to build a production-ready monorepo",
  })
  lessons?: string;

  @ApiPropertyOptional({
    description: "Technologies used",
    example: ["Next.js", "NestJS", "PostgreSQL", "Prisma"],
    type: [String],
  })
  techStack?: string[];

  @ApiPropertyOptional({
    description: "Key features",
    example: ["Dark Mode", "Animations", "Admin Dashboard"],
    type: [String],
  })
  features?: string[];

  @ApiPropertyOptional({
    description: "Live demo URL",
    example: "https://your-portfolio.com",
  })
  demoUrl?: string;

  @ApiPropertyOptional({
    description: "GitHub repository URL",
    example: "https://github.com/yourusername/portfolio",
  })
  githubUrl?: string;

  @ApiPropertyOptional({
    description: "Whether this project is featured",
    example: true,
  })
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: "Whether this project is published",
    example: true,
  })
  isPublished?: boolean;

  // ===== PROJECT IMAGES (will be populated by the frontend) =====
  // Note: Images are a separate model, we'll handle them separately

  @ApiProperty({
    description: "Creation timestamp",
    example: "2026-08-16T00:52:00.000Z",
  })
  createdAt?: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2026-08-16T00:52:00.000Z",
  })
  updatedAt?: Date;
}
