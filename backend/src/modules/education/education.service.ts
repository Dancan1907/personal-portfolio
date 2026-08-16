// ============================================
// EDUCATION SERVICE - Business Logic
// ============================================
// This service handles all database operations for education entries
// Includes public viewing and admin CRUD operations

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEducationDto } from "./dto/create-education.dto";
import { UpdateEducationDto } from "./dto/update-education.dto";
import { EducationResponseDto } from "./dto/education-response.dto";
import { Education } from "@prisma/client";

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper: Convert Prisma Education to EducationResponseDto
   * This ensures consistent response format across all endpoints
   * Converts null values to undefined for cleaner JSON output
   */
  private toEducationResponseDto(education: Education): EducationResponseDto {
    return {
      id: education.id,
      institution: education.institution,
      degree: education.degree,
      field: education.field ?? undefined,
      location: education.location ?? undefined,
      startDate: education.startDate,
      endDate: education.endDate ?? undefined,
      isPresent: education.isPresent,
      description: education.description ?? undefined,
      coursework: education.coursework ?? undefined,
      achievements: education.achievements ?? undefined,
      gpa: education.gpa ?? undefined,
      order: education.order ?? undefined,
      createdAt: education.createdAt,
      updatedAt: education.updatedAt,
    };
  }

  /**
   * Get all education entries, ordered by start date (newest first)
   * @returns Array of all education entries
   */
  async getAllEducation(): Promise<EducationResponseDto[]> {
    // Get all education entries, sorted by start date descending (newest first)
    // This creates a timeline view
    const education = await this.prisma.education.findMany({
      orderBy: [
        { startDate: "desc" }, // Newest first
        { order: "asc" }, // Then by custom order
      ],
    });

    return education.map((edu) => this.toEducationResponseDto(edu));
  }

  /**
   * Get a single education entry by ID
   * @param id - The education ID
   * @returns The education data
   * @throws NotFoundException if education doesn't exist
   */
  async getEducationById(id: string): Promise<EducationResponseDto> {
    const education = await this.prisma.education.findUnique({
      where: { id },
    });

    if (!education) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }

    return this.toEducationResponseDto(education);
  }

  /**
   * Create a new education entry
   * @param data - Education data to create
   * @returns The created education
   * @throws BadRequestException if validation fails
   */
  async createEducation(
    data: CreateEducationDto,
  ): Promise<EducationResponseDto> {
    // Validate required fields
    if (!data.institution) {
      throw new BadRequestException("Institution is required");
    }
    if (!data.degree) {
      throw new BadRequestException("Degree is required");
    }
    if (!data.startDate) {
      throw new BadRequestException("Start date is required");
    }

    // Convert string dates to Date objects
    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : null;

    // Validate date logic: end date must be after start date if provided
    if (endDate && endDate <= startDate) {
      throw new BadRequestException("End date must be after start date");
    }

    // If isPresent is true, endDate should be null
    if (data.isPresent && data.endDate) {
      throw new BadRequestException(
        "Cannot have an end date for current education",
      );
    }

    // Create the education entry in the database
    const education = await this.prisma.education.create({
      data: {
        institution: data.institution,
        degree: data.degree,
        field: data.field,
        location: data.location,
        startDate: startDate,
        endDate: endDate,
        isPresent: data.isPresent ?? false,
        description: data.description,
        coursework: data.coursework || [],
        achievements: data.achievements || [],
        gpa: data.gpa,
        order: data.order ?? 0,
      },
    });

    return this.toEducationResponseDto(education);
  }

  /**
   * Update an existing education entry
   * @param id - The education ID
   * @param data - Education data to update
   * @returns The updated education
   * @throws NotFoundException if education doesn't exist
   */
  async updateEducation(
    id: string,
    data: UpdateEducationDto,
  ): Promise<EducationResponseDto> {
    // Check if education exists
    const existingEducation = await this.prisma.education.findUnique({
      where: { id },
    });

    if (!existingEducation) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }

    // Build update data object
    const updateData: any = {};

    // Only include fields that are provided
    if (data.institution !== undefined)
      updateData.institution = data.institution;
    if (data.degree !== undefined) updateData.degree = data.degree;
    if (data.field !== undefined) updateData.field = data.field;
    if (data.location !== undefined) updateData.location = data.location;

    // Handle date conversions
    if (data.startDate !== undefined) {
      updateData.startDate = new Date(data.startDate);
    }
    if (data.endDate !== undefined) {
      updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    }

    if (data.isPresent !== undefined) {
      updateData.isPresent = data.isPresent;
      // If isPresent is true, clear endDate
      if (data.isPresent) {
        updateData.endDate = null;
      }
    }

    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.coursework !== undefined) updateData.coursework = data.coursework;
    if (data.achievements !== undefined)
      updateData.achievements = data.achievements;
    if (data.gpa !== undefined) updateData.gpa = data.gpa;
    if (data.order !== undefined) updateData.order = data.order;

    const updatedEducation = await this.prisma.education.update({
      where: { id },
      data: updateData,
    });

    return this.toEducationResponseDto(updatedEducation);
  }

  /**
   * Delete an education entry
   * @param id - The education ID
   * @throws NotFoundException if education doesn't exist
   */
  async deleteEducation(id: string): Promise<void> {
    // Check if education exists
    const existingEducation = await this.prisma.education.findUnique({
      where: { id },
    });

    if (!existingEducation) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }

    // Delete the education
    await this.prisma.education.delete({
      where: { id },
    });
  }
}
