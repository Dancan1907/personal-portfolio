// ============================================
// CREATE PROFILE DTO - Data Transfer Object (FIXED)
// ============================================
// 'name' is now required because Prisma expects it
// All other fields remain optional

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsUrl,
  IsEmail,
  IsNotEmpty,
} from "class-validator";

export class CreateProfileDto {
  // ===== REQUIRED FIELDS =====
  // 'name' is required because it's NOT optional in the Prisma schema

  @ApiProperty({
    description: "Full name displayed on portfolio",
    example: "Dancan Kalerwa",
    required: true,
  })
  @IsNotEmpty({ message: "Name is required" })
  @IsString()
  name!: string; // ← Changed from optional to required

  // ===== OPTIONAL FIELDS =====

  @ApiPropertyOptional({
    description: "Professional title (e.g., Full Stack Developer)",
    example: "Full Stack Developer",
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: "Biography or about text",
    example: "Passionate developer with 5+ years of experience...",
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: "URL to profile picture",
    example: "https://example.com/avatar.jpg",
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: "URL to resume PDF",
    example: "https://example.com/resume.pdf",
  })
  @IsOptional()
  @IsUrl()
  resumeUrl?: string;

  // ===== SOCIAL LINKS =====

  @ApiPropertyOptional({
    description: "GitHub profile URL",
    example: "https://github.com/dancan1907",
  })
  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @ApiPropertyOptional({
    description: "LinkedIn profile URL",
    example: "https://linkedin.com/in/dancan-kalerwa",
  })
  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @ApiPropertyOptional({
    description: "Twitter/X profile URL",
    example: "https://twitter.com/dancan",
  })
  @IsOptional()
  @IsUrl()
  twitterUrl?: string;

  @ApiPropertyOptional({
    description: "Personal website URL",
    example: "https://dancan.dev",
  })
  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  // ===== CONTACT INFORMATION =====

  @ApiPropertyOptional({
    description: "Public email address",
    example: "hello@dancan.dev",
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: "Location (City, Country)",
    example: "Nairobi, Kenya",
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: "Phone number",
    example: "+254 700 123 456",
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
