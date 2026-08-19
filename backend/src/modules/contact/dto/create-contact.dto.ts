// ============================================
// CREATE CONTACT DTO - Data Transfer Object
// ============================================
// This DTO validates the data sent to POST /api/v1/contact
// All fields are validated using class-validator decorators

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MaxLength,
} from "class-validator";

export class CreateContactDto {
  @ApiProperty({
    description: "Sender's full name",
    example: "Max Versteppen",
    required: true,
  })
  @IsNotEmpty({ message: "Name is required" })
  @IsString()
  @MaxLength(100, { message: "Name must not exceed 100 characters" })
  name?: string;

  @ApiProperty({
    description: "Sender's email address",
    example: "max@example.com",
    required: true,
  })
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @MaxLength(100, { message: "Email must not exceed 100 characters" })
  email?: string;

  @ApiPropertyOptional({
    description: "Message subject",
    example: "Project Inquiry",
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: "Subject must not exceed 200 characters" })
  subject?: string;

  @ApiProperty({
    description: "Message content",
    example: "I would like to discuss a potential project...",
    required: true,
  })
  @IsNotEmpty({ message: "Message is required" })
  @IsString()
  @MaxLength(5000, { message: "Message must not exceed 5000 characters" })
  message?: string;
}
