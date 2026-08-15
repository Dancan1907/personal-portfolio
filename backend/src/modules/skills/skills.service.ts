// ============================================
// SKILLS SERVICE - Business Logic
// ============================================

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException, // ← ADD THIS IMPORT
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
   */
  async getAllSkills(): Promise<SkillResponseDto[]> {
    const skills = await this.prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }, { name: "asc" }],
    });

    return skills.map((skill) => this.toSkillResponseDto(skill));
  }

  /**
   * Get skills by category
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
   * @throws BadRequestException if category or name is missing
   * @throws ConflictException if skill already exists
   */
  async createSkill(data: CreateSkillDto): Promise<SkillResponseDto> {
    // ✅ FIX: Ensure required fields are provided
    if (!data.category) {
      throw new BadRequestException("Category is required");
    }
    if (!data.name) {
      throw new BadRequestException("Name is required");
    }

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
        category: data.category, // ← Now guaranteed to be a string
        name: data.name, // ← Now guaranteed to be a string
        icon: data.icon,
        proficiency: data.proficiency,
        order: data.order ?? 0,
      },
    });

    return this.toSkillResponseDto(skill);
  }

  /**
   * Update an existing skill
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

    // ✅ FIX: If updating category AND name, check for duplicates
    if (data.category && data.name) {
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

    // ✅ FIX: Build update data dynamically
    const updateData: any = {};
    if (data.category !== undefined) updateData.category = data.category;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.proficiency !== undefined)
      updateData.proficiency = data.proficiency;
    if (data.order !== undefined) updateData.order = data.order;

    const updatedSkill = await this.prisma.skill.update({
      where: { id },
      data: updateData,
    });

    return this.toSkillResponseDto(updatedSkill);
  }

  /**
   * Delete a skill
   */
  async deleteSkill(id: string): Promise<void> {
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
