// ============================================
// SKILLS SERVICE - Business Logic
// ============================================
// This service handles all database operations for skills
// Includes public viewing and admin CRUD operations

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSkillDto } from "./dto/create-skill.dto";
import { UpdateSkillDto } from "./dto/update-skill.dto";
import { SkillResponseDto } from "./dto/skill-response.dto";
import { Skill } from "@prisma/client";

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper: Convert Prisma Skill to SkillResponseDto
   */
  private toSkillResponseDto(skill: Skill): SkillResponseDto {
    return {
      id: skill.id,
      category: skill.category,
      name: skill.name,
      icon: skill.icon ?? undefined,
      proficiency: skill.proficiency ?? undefined,
      order: skill.order ?? undefined,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt,
    };
  }

  /**
   * Get all skills, ordered by category then by order
   * @returns Array of all skills
   */
  async getAllSkills(): Promise<SkillResponseDto[]> {
    const skills = await this.prisma.skill.findMany({
      orderBy: [
        { category: "asc" }, // Group by category (A-Z)
        { order: "asc" }, // Then by order (0, 1, 2, ...)
        { name: "asc" }, // Then alphabetically
      ],
    });

    return skills.map((skill) => this.toSkillResponseDto(skill));
  }

  /**
   * Get skills by category
   * @param category - The category to filter by
   * @returns Array of skills in the category
   */
  async getSkillsByCategory(category: string): Promise<SkillResponseDto[]> {
    const skills = await this.prisma.skill.findMany({
      where: { category },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });

    return skills.map((skill) => this.toSkillResponseDto(skill));
  }

  /**
   * Get all unique categories
   * @returns Array of category names
   */
  async getCategories(): Promise<string[]> {
    const result = await this.prisma.skill.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });

    return result.map((item) => item.category);
  }

  /**
   * Get a single skill by ID
   * @param id - The skill ID
   * @returns The skill data
   * @throws NotFoundException if skill doesn't exist
   */
  async getSkillById(id: string): Promise<SkillResponseDto> {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    return this.toSkillResponseDto(skill);
  }

  /**
   * Create a new skill
   * @param data - Skill data to create
   * @returns The created skill
   * @throws ConflictException if skill already exists in category
   */
  async createSkill(data: CreateSkillDto): Promise<SkillResponseDto> {
    // Check if skill already exists in this category
    const existing = await this.prisma.skill.findUnique({
      where: {
        category_name: {
          category: data.category,
          name: data.name,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Skill "${data.name}" already exists in category "${data.category}"`,
      );
    }

    const skill = await this.prisma.skill.create({
      data: {
        category: data.category,
        name: data.name,
        icon: data.icon,
        proficiency: data.proficiency,
        order: data.order ?? 0,
      },
    });

    return this.toSkillResponseDto(skill);
  }

  /**
   * Update an existing skill
   * @param id - The skill ID
   * @param data - Skill data to update
   * @returns The updated skill
   * @throws NotFoundException if skill doesn't exist
   * @throws ConflictException if update would create a duplicate
   */
  async updateSkill(
    id: string,
    data: UpdateSkillDto,
  ): Promise<SkillResponseDto> {
    // Check if skill exists
    const existingSkill = await this.prisma.skill.findUnique({
      where: { id },
    });

    if (!existingSkill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    // If category AND name are being updated, check for duplicates
    if (data.category && data.name) {
      // Check if another skill with the same category+name exists (excluding this one)
      const duplicate = await this.prisma.skill.findFirst({
        where: {
          category: data.category,
          name: data.name,
          id: { not: id },
        },
      });

      if (duplicate) {
        throw new ConflictException(
          `Skill "${data.name}" already exists in category "${data.category}"`,
        );
      }
    }

    const updatedSkill = await this.prisma.skill.update({
      where: { id },
      data: {
        ...(data.category !== undefined && { category: data.category }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.proficiency !== undefined && {
          proficiency: data.proficiency,
        }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });

    return this.toSkillResponseDto(updatedSkill);
  }

  /**
   * Delete a skill
   * @param id - The skill ID
   * @throws NotFoundException if skill doesn't exist
   */
  async deleteSkill(id: string): Promise<void> {
    // Check if skill exists
    const existingSkill = await this.prisma.skill.findUnique({
      where: { id },
    });

    if (!existingSkill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    await this.prisma.skill.delete({
      where: { id },
    });
  }
}
