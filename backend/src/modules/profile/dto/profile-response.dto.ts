// ============================================
// PROFILE RESPONSE DTO - API Response Format
// ============================================
// This DTO ensures consistent response structure
// It excludes sensitive data (userId is internal)

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ProfileResponseDto {
  @ApiProperty({
    description: "Unique profile ID",
    example: "cls5x3v8p0000v8q7a1b2c3d4",
  })
  id?: string;

  @ApiProperty({
    description: "Full name",
    example: "Dancan Kalerwa",
  })
  name?: string;

  @ApiPropertyOptional({
    description: "Professional title",
    example: "Full Stack Developer",
  })
  title?: string;

  @ApiPropertyOptional({
    description: "Biography",
    example: "Passionate developer...",
  })
  bio?: string;

  @ApiPropertyOptional({
    description: "Avatar image URL",
    example: "https://example.com/avatar.jpg",
  })
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: "Resume PDF URL",
    example: "https://example.com/resume.pdf",
  })
  resumeUrl?: string;

  @ApiPropertyOptional({
    description: "GitHub URL",
    example: "https://github.com/dancan1907",
  })
  githubUrl?: string;

  @ApiPropertyOptional({
    description: "LinkedIn URL",
    example: "https://linkedin.com/in/dancan-kalerwa",
  })
  linkedinUrl?: string;

  @ApiPropertyOptional({
    description: "Twitter URL",
    example: "https://twitter.com/dancan",
  })
  twitterUrl?: string;

  @ApiPropertyOptional({
    description: "Website URL",
    example: "https://dancan.dev",
  })
  websiteUrl?: string;

  @ApiPropertyOptional({
    description: "Public email",
    example: "hello@dancan.dev",
  })
  email?: string;

  @ApiPropertyOptional({
    description: "Location",
    example: "Nairobi, Kenya",
  })
  location?: string;

  @ApiPropertyOptional({
    description: "Phone number",
    example: "+254 700 123 456",
  })
  phone?: string;

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
