// ============================================
// CONTACT SERVICE - Business Logic (UPDATED)
// ============================================
// Using Resend API for email delivery

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
import { Resend } from "resend";

@Injectable()
export class ContactService {
  private resend: Resend;

  constructor(private readonly prisma: PrismaService) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

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

  async getAllMessages(): Promise<ContactResponseDto[]> {
    const messages = await this.prisma.contactMessage.findMany({
      orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
    });
    return messages.map((msg) => this.toContactResponseDto(msg));
  }

  async getUnreadCount(): Promise<number> {
    return this.prisma.contactMessage.count({
      where: { isRead: false },
    });
  }

  async getMessageById(id: string): Promise<ContactResponseDto> {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return this.toContactResponseDto(message);
  }

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
        isRead: false,
        replied: false,
      },
    });

    // ============================================
    // SEND EMAIL VIA RESEND
    // ============================================
    try {
      const recipient =
        process.env.EMAIL_RECIPIENT || "dancankalerwa@gmail.com";

      const { data: emailData, error } = await this.resend.emails.send({
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: [recipient],
        subject: `📩 New Contact Message from ${data.name}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>From:</strong> ${data.name} (${data.email})</p>
          ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ""}
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            ${data.message}
          </div>
          <hr>
          <p style="color: #888; font-size: 12px;">
            Sent from your portfolio contact form.<br>
            IP: ${ipAddress || "N/A"} | User Agent: ${userAgent || "N/A"}
          </p>
          <p style="color: #888; font-size: 12px;">
            <a href="${process.env.FRONTEND_URL}/dashboard/messages">View in Dashboard</a>
          </p>
        `,
      });

      if (error) {
        console.error("❌ Resend error:", error);
      } else {
        console.log(`📧 Email sent via Resend! ID: ${emailData?.id}`);
        console.log(`📧 Recipient: ${recipient}`);
      }
    } catch (error) {
      console.error("❌ Failed to send email:", error);
    }

    return this.toContactResponseDto(message);
  }

  async updateMessage(
    id: string,
    data: UpdateContactDto,
  ): Promise<ContactResponseDto> {
    const existingMessage = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    const updateData: any = {};
    if (data.isRead !== undefined) updateData.isRead = data.isRead;
    if (data.replied !== undefined) updateData.replied = data.replied;
    if (data.repliedAt !== undefined) {
      updateData.repliedAt = data.repliedAt ? new Date(data.repliedAt) : null;
    }

    if (data.replied === true && !data.repliedAt) {
      updateData.repliedAt = new Date();
    }

    const updatedMessage = await this.prisma.contactMessage.update({
      where: { id },
      data: updateData,
    });

    return this.toContactResponseDto(updatedMessage);
  }

  async deleteMessage(id: string): Promise<void> {
    const existingMessage = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    await this.prisma.contactMessage.delete({
      where: { id },
    });
  }
}
