// ============================================
// CONTACT SERVICE - Business Logic
// ============================================
// This service handles all database operations for contact messages
// Includes public submission and admin management

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { ContactResponseDto } from "./dto/contact-response.dto";
import { ContactMessage } from "@prisma/client";

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper: Convert Prisma ContactMessage to ContactResponseDto
   * This ensures consistent response format across all endpoints
   * Converts null values to undefined for cleaner JSON output
   */
  private toContactResponseDto(message: ContactMessage): ContactResponseDto {
    return {
      id: message.id,
      name: message.name,
      email: message.email,
      subject: message.subject ?? undefined,
      message: message.message,
      isRead: message.isRead,
      replied: message.replied,
      repliedAt: message.repliedAt ?? undefined,
      ipAddress: message.ipAddress ?? undefined,
      userAgent: message.userAgent ?? undefined,
      createdAt: message.createdAt,
    };
  }

  /**
   * Submit a new contact message (public)
   * @param data - Contact message data
   * @param ipAddress - Optional IP address of the sender
   * @param userAgent - Optional user agent of the sender
   * @returns The created message
   */
  async submitMessage(
    data: CreateContactDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ContactResponseDto> {
    // Validate required fields
    if (!data.name) {
      throw new BadRequestException("Name is required");
    }
    if (!data.email) {
      throw new BadRequestException("Email is required");
    }
    if (!data.message) {
      throw new BadRequestException("Message is required");
    }

    // Create the message in the database
    const message = await this.prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        ipAddress: ipAddress,
        userAgent: userAgent,
        isRead: false, // Default: unread
        replied: false, // Default: not replied
      },
    });

    // TODO: Send email notification to admin (optional)
    // This will be implemented later

    return this.toContactResponseDto(message);
  }

  /**
   * Get all contact messages (admin only)
   * @returns Array of all messages, sorted by newest first
   */
  async getAllMessages(): Promise<ContactResponseDto[]> {
    const messages = await this.prisma.contactMessage.findMany({
      orderBy: [
        { isRead: "asc" }, // Unread messages first
        { createdAt: "desc" }, // Then newest first
      ],
    });

    return messages.map((msg) => this.toContactResponseDto(msg));
  }

  /**
   * Get unread messages count (admin only)
   * @returns Number of unread messages
   */
  async getUnreadCount(): Promise<number> {
    return this.prisma.contactMessage.count({
      where: { isRead: false },
    });
  }

  /**
   * Get a single contact message by ID (admin only)
   * @param id - The message ID
   * @returns The message data
   * @throws NotFoundException if message doesn't exist
   */
  async getMessageById(id: string): Promise<ContactResponseDto> {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return this.toContactResponseDto(message);
  }

  /**
   * Update a contact message (admin only)
   * Primarily used to mark messages as read or replied
   * @param id - The message ID
   * @param data - Update data
   * @returns The updated message
   * @throws NotFoundException if message doesn't exist
   */
  async updateMessage(
    id: string,
    data: UpdateContactDto,
  ): Promise<ContactResponseDto> {
    // Check if message exists
    const existingMessage = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    // Build update data
    const updateData: any = {};
    if (data.isRead !== undefined) updateData.isRead = data.isRead;
    if (data.replied !== undefined) updateData.replied = data.replied;
    if (data.repliedAt !== undefined) {
      updateData.repliedAt = data.repliedAt ? new Date(data.repliedAt) : null;
    }

    // If replied is set to true and repliedAt is not provided, set it to now
    if (data.replied === true && !data.repliedAt) {
      updateData.repliedAt = new Date();
    }

    const updatedMessage = await this.prisma.contactMessage.update({
      where: { id },
      data: updateData,
    });

    return this.toContactResponseDto(updatedMessage);
  }

  /**
   * Delete a contact message (admin only)
   * @param id - The message ID
   * @throws NotFoundException if message doesn't exist
   */
  async deleteMessage(id: string): Promise<void> {
    // Check if message exists
    const existingMessage = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    // Delete the message
    await this.prisma.contactMessage.delete({
      where: { id },
    });
  }
}
