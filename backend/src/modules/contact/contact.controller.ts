// ============================================
// CONTACT CONTROLLER - API Endpoints
// ============================================
// This controller handles all HTTP requests related to contact messages
// Public endpoint: POST (submit message)
// Protected endpoints: GET, PUT, DELETE (admin only)

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { ContactResponseDto } from "./dto/contact-response.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Role } from "@prisma/client";
import { Request } from "express";

@ApiTags("Contact")
@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  /**
   * POST /api/v1/contact
   * Submit a new contact message (public)
   * This endpoint is accessible without authentication
   */
  @Post()
  @Public()
  @ApiOperation({ summary: "Submit a new contact message (public)" })
  @ApiResponse({
    status: 201,
    description: "Message sent successfully",
    type: ContactResponseDto,
  })
  @ApiResponse({ status: 400, description: "Validation error" })
  async submitMessage(
    @Body() createContactDto: CreateContactDto,
    @Req() req: Request,
  ): Promise<ContactResponseDto> {
    // Extract IP address and user agent for anti-spam
    const ipAddress = req.ip || req.socket?.remoteAddress;
    const userAgent = req.headers["user-agent"];

    return this.contactService.submitMessage(
      createContactDto,
      ipAddress,
      userAgent,
    );
  }

  /**
   * GET /api/v1/contact
   * Get all contact messages (admin only)
   * Requires authentication and ADMIN role
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get all contact messages (admin only)" })
  @ApiResponse({
    status: 200,
    description: "List of all messages",
    type: [ContactResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getAllMessages(): Promise<ContactResponseDto[]> {
    return this.contactService.getAllMessages();
  }

  /**
   * GET /api/v1/contact/unread-count
   * Get count of unread messages (admin only)
   * Requires authentication and ADMIN role
   */
  @Get("unread-count")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get count of unread messages (admin only)" })
  @ApiResponse({
    status: 200,
    description: "Number of unread messages",
    schema: { example: { unread: 5 } },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getUnreadCount(): Promise<{ unread: number }> {
    const count = await this.contactService.getUnreadCount();
    return { unread: count };
  }

  /**
   * GET /api/v1/contact/:id
   * Get a contact message by ID (admin only)
   * Requires authentication and ADMIN role
   */
  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get a contact message by ID (admin only)" })
  @ApiParam({
    name: "id",
    description: "Message ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  @ApiResponse({
    status: 200,
    description: "Message found",
    type: ContactResponseDto,
  })
  @ApiResponse({ status: 404, description: "Message not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getMessageById(@Param("id") id: string): Promise<ContactResponseDto> {
    return this.contactService.getMessageById(id);
  }

  /**
   * PUT /api/v1/contact/:id
   * Update a contact message (admin only)
   * Requires authentication and ADMIN role
   */
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update a contact message (admin only)" })
  @ApiParam({
    name: "id",
    description: "Message ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  @ApiResponse({
    status: 200,
    description: "Message updated",
    type: ContactResponseDto,
  })
  @ApiResponse({ status: 404, description: "Message not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async updateMessage(
    @Param("id") id: string,
    @Body() updateContactDto: UpdateContactDto,
  ): Promise<ContactResponseDto> {
    return this.contactService.updateMessage(id, updateContactDto);
  }

  /**
   * DELETE /api/v1/contact/:id
   * Delete a contact message (admin only)
   * Requires authentication and ADMIN role
   */
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete a contact message (admin only)" })
  @ApiParam({
    name: "id",
    description: "Message ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  @ApiResponse({ status: 204, description: "Message deleted" })
  @ApiResponse({ status: 404, description: "Message not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async deleteMessage(@Param("id") id: string): Promise<void> {
    await this.contactService.deleteMessage(id);
  }
}
