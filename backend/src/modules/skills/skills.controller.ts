// ============================================
// SKILLS CONTROLLER - API Endpoints
// ============================================
// This controller handles all HTTP requests related to skills
// Public endpoints: GET (view skills)
// Protected endpoints: POST, PUT, DELETE (admin only)

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { SkillsService } from "./skills.service";
import { CreateSkillDto } from "./dto/create-skill.dto";
import { UpdateSkillDto } from "./dto/update-skill.dto";
import { SkillResponseDto } from "./dto/skill-response.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Role } from "@prisma/client";

@ApiTags("Skills")
@Controller("skills")
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  /**
   * GET /api/v1/skills
   * Get all skills (public)
   */
  @Get()
  @Public()
  @ApiOperation({ summary: "Get all skills (public)" })
  @ApiResponse({
    status: 200,
    description: "List of all skills",
    type: [SkillResponseDto],
  })
  async getAllSkills(): Promise<SkillResponseDto[]> {
    return this.skillsService.getAllSkills();
  }

  /**
   * GET /api/v1/skills/categories
   * Get all unique categories (public)
   */
  @Get("categories")
  @Public()
  @ApiOperation({ summary: "Get all skill categories (public)" })
  @ApiResponse({
    status: 200,
    description: "List of unique categories",
    type: [String],
  })
  async getCategories(): Promise<string[]> {
    return this.skillsService.getCategories();
  }

  /**
   * GET /api/v1/skills/category/:category
   * Get skills by category (public)
   */
  @Get("category/:category")
  @Public()
  @ApiOperation({ summary: "Get skills by category (public)" })
  @ApiParam({
    name: "category",
    description: "Skill category (e.g., Frontend, Backend)",
    example: "Frontend",
  })
  @ApiResponse({
    status: 200,
    description: "List of skills in the category",
    type: [SkillResponseDto],
  })
  async getSkillsByCategory(
    @Param("category") category: string,
  ): Promise<SkillResponseDto[]> {
    return this.skillsService.getSkillsByCategory(category);
  }

  /**
   * GET /api/v1/skills/:id
   * Get a single skill by ID (public)
   */
  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get a single skill by ID (public)" })
  @ApiParam({
    name: "id",
    description: "Skill ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  @ApiResponse({
    status: 200,
    description: "Skill found",
    type: SkillResponseDto,
  })
  @ApiResponse({ status: 404, description: "Skill not found" })
  async getSkillById(@Param("id") id: string): Promise<SkillResponseDto> {
    return this.skillsService.getSkillById(id);
  }

  /**
   * POST /api/v1/skills
   * Create a new skill (admin only)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create a new skill (admin only)" })
  @ApiResponse({
    status: 201,
    description: "Skill created",
    type: SkillResponseDto,
  })
  @ApiResponse({ status: 409, description: "Skill already exists in category" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createSkill(
    @Body() createSkillDto: CreateSkillDto,
  ): Promise<SkillResponseDto> {
    return this.skillsService.createSkill(createSkillDto);
  }

  /**
   * PUT /api/v1/skills/:id
   * Update a skill (admin only)
   */
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update a skill (admin only)" })
  @ApiParam({
    name: "id",
    description: "Skill ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  @ApiResponse({
    status: 200,
    description: "Skill updated",
    type: SkillResponseDto,
  })
  @ApiResponse({ status: 404, description: "Skill not found" })
  @ApiResponse({ status: 409, description: "Duplicate skill in category" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async updateSkill(
    @Param("id") id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ): Promise<SkillResponseDto> {
    return this.skillsService.updateSkill(id, updateSkillDto);
  }

  /**
   * DELETE /api/v1/skills/:id
   * Delete a skill (admin only)
   */
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete a skill (admin only)" })
  @ApiParam({
    name: "id",
    description: "Skill ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  @ApiResponse({ status: 204, description: "Skill deleted" })
  @ApiResponse({ status: 404, description: "Skill not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async deleteSkill(@Param("id") id: string): Promise<void> {
    await this.skillsService.deleteSkill(id);
  }
}
