// ============================================
// UPDATE CONTACT DTO - Data Transfer Object
// ============================================
// This DTO validates updates to a contact message
// Primarily used for marking messages as read or replied

import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, IsDateString } from "class-validator";

export class UpdateContactDto {
  @ApiPropertyOptional({
    description: "Whether the message has been read by admin",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiPropertyOptional({
    description: "Whether the admin has replied to the message",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  replied?: boolean;

  @ApiPropertyOptional({
    description: "When the admin replied to the message",
    example: "2026-08-16T03:00:00.000Z",
  })
  @IsOptional()
  @IsDateString({}, { message: "Replied at must be a valid date" })
  repliedAt?: string;
}
