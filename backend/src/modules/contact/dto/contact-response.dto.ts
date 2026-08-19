// ============================================
// CONTACT RESPONSE DTO - API Response Format
// ============================================
// This DTO ensures consistent response structure
// Includes all contact message fields and metadata

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ContactResponseDto {
  @ApiProperty({
    description: "Unique message ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  id?: string;

  @ApiProperty({
    description: "Sender's name",
    example: "John Doe",
  })
  name?: string;

  @ApiProperty({
    description: "Sender's email address",
    example: "john@example.com",
  })
  email?: string;

  @ApiPropertyOptional({
    description: "Message subject",
    example: "Project Inquiry",
  })
  subject?: string;

  @ApiProperty({
    description: "Message content",
    example: "I would like to discuss a potential project...",
  })
  message?: string;

  @ApiProperty({
    description: "Whether the message has been read",
    example: false,
  })
  isRead?: boolean;

  @ApiProperty({
    description: "Whether the admin has replied",
    example: false,
  })
  replied?: boolean;

  @ApiPropertyOptional({
    description: "When the admin replied",
    example: "2026-08-16T03:00:00.000Z",
  })
  repliedAt?: Date;

  @ApiPropertyOptional({
    description: "IP address of the sender",
    example: "192.168.1.1",
  })
  ipAddress?: string;

  @ApiPropertyOptional({
    description: "User agent of the sender's browser",
    example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  })
  userAgent?: string;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2026-08-16T03:00:00.000Z",
  })
  createdAt?: Date;
}
