// ============================================
// EXPERIENCE SERVICE - Business Logic
// ============================================
// This service handles all database operations for experience entries
// Includes public viewing and admin CRUD operations

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateExperienceDto } from "./dto/create-experience.dto";
import { UpdateExperienceDto } from "./dto/update-experience.dto";
import { ExperienceResponseDto } from "./dto/experience-response.dto";
import { Experience } from "@prisma/client";

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper: Convert Prisma Experience to ExperienceResponseDto
   * This ensures consistent response format across all endpoints
   * Converts null values to undefined for cleaner JSON output
   */
  private toExperienceResponseDto(
    experience: Experience,
  ): ExperienceResponseDto {
    return {
      id: experience.id,
      role: experience.role,
      organization: experience.organization,
      location: experience.location ?? undefined,
      startDate: experience.startDate,
      endDate: experience.endDate ?? undefined,
      isPresent: experience.isPresent,
      description: experience.description ?? undefined,
      responsibilities: experience.responsibilities ?? undefined,
      technologies: experience.technologies ?? undefined,
      achievements: experience.achievements ?? undefined,
      order: experience.order ?? undefined,
      createdAt: experience.createdAt,
      updatedAt: experience.updatedAt,
    };
  }

  /**
   * Get all experience entries, ordered by start date (newest first)
   * @returns Array of all experience entries
   */
  async getAllExperience(): Promise<ExperienceResponseDto[]> {
    // Get all experience entries, sorted by start date descending (newest first)
    // This creates a timeline view
    const experience = await this.prisma.experience.findMany({
      orderBy: [
        { startDate: "desc" }, // Newest first
        { order: "asc" }, // Then by custom order
      ],
    });

    return experience.map((exp) => this.toExperienceResponseDto(exp));
  }

  /**
   * Get a single experience entry by ID
   * @param id - The experience ID
   * @returns The experience data
   * @throws NotFoundException if experience doesn't exist
   */
  async getExperienceById(id: string): Promise<ExperienceResponseDto> {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    return this.toExperienceResponseDto(experience);
  }

  /**
   * Create a new experience entry
   * @param data - Experience data to create
   * @returns The created experience
   * @throws BadRequestException if validation fails
   */
  async createExperience(
    data: CreateExperienceDto,
  ): Promise<ExperienceResponseDto> {
    // Validate required fields
    if (!data.role) {
      throw new BadRequestException("Role is required");
    }
    if (!data.organization) {
      throw new BadRequestException("Organization is required");
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
        "Cannot have an end date for a current position",
      );
    }

    // Create the experience entry in the database
    const experience = await this.prisma.experience.create({
      data: {
        role: data.role,
        organization: data.organization,
        location: data.location,
        startDate: startDate,
        endDate: endDate,
        isPresent: data.isPresent ?? false,
        description: data.description,
        responsibilities: data.responsibilities || [],
        technologies: data.technologies || [],
        achievements: data.achievements || [],
        order: data.order ?? 0,
      },
    });

    return this.toExperienceResponseDto(experience);
  }

  /**
   * Update an existing experience entry
   * @param id - The experience ID
   * @param data - Experience data to update
   * @returns The updated experience
   * @throws NotFoundException if experience doesn't exist
   */
  async updateExperience(
    id: string,
    data: UpdateExperienceDto,
  ): Promise<ExperienceResponseDto> {
    // Check if experience exists
    const existingExperience = await this.prisma.experience.findUnique({
      where: { id },
    });

    if (!existingExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    // Build update data object
    const updateData: any = {};

    // Only include fields that are provided
    if (data.role !== undefined) updateData.role = data.role;
    if (data.organization !== undefined)
      updateData.organization = data.organization;
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
    if (data.responsibilities !== undefined)
      updateData.responsibilities = data.responsibilities;
    if (data.technologies !== undefined)
      updateData.technologies = data.technologies;
    if (data.achievements !== undefined)
      updateData.achievements = data.achievements;
    if (data.order !== undefined) updateData.order = data.order;

    const updatedExperience = await this.prisma.experience.update({
      where: { id },
      data: updateData,
    });

    return this.toExperienceResponseDto(updatedExperience);
  }

  /**
   * Delete an experience entry
   * @param id - The experience ID
   * @throws NotFoundException if experience doesn't exist
   */
  async deleteExperience(id: string): Promise<void> {
    // Check if experience exists
    const existingExperience = await this.prisma.experience.findUnique({
      where: { id },
    });

    if (!existingExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    // Delete the experience
    await this.prisma.experience.delete({
      where: { id },
    });
  }
}
