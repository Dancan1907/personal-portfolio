// ============================================
// EXPERIENCE CONTROLLER - API Endpoints
// ============================================
// This controller handles all HTTP requests related to experience
// Public endpoints: GET (view experience)
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
import { ExperienceService } from "./experience.service";
import { CreateExperienceDto } from "./dto/create-experience.dto";
import { UpdateExperienceDto } from "./dto/update-experience.dto";
import { ExperienceResponseDto } from "./dto/experience-response.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Role } from "@prisma/client";

@ApiTags("Experience")
@Controller("experience")
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  /**
   * GET /api/v1/experience
   * Get all experience entries (public)
   * This endpoint is accessible without authentication
   */
  @Get()
  @Public()
  @ApiOperation({ summary: "Get all experience entries (public)" })
  @ApiResponse({
    status: 200,
    description: "List of all experience entries sorted by date (newest first)",
    type: [ExperienceResponseDto],
  })
  async getAllExperience(): Promise<ExperienceResponseDto[]> {
    return this.experienceService.getAllExperience();
  }

  /**
   * GET /api/v1/experience/:id
   * Get a single experience entry by ID (public)
   * This endpoint is accessible without authentication
   */
  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get experience entry by ID (public)" })
  @ApiParam({
    name: "id",
    description: "Experience ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  @ApiResponse({
    status: 200,
    description: "Experience entry found",
    type: ExperienceResponseDto,
  })
  @ApiResponse({ status: 404, description: "Experience entry not found" })
  async getExperienceById(
    @Param("id") id: string,
  ): Promise<ExperienceResponseDto> {
    return this.experienceService.getExperienceById(id);
  }

  /**
   * POST /api/v1/experience
   * Create a new experience entry (admin only)
   * Requires authentication and ADMIN role
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create a new experience entry (admin only)" })
  @ApiResponse({
    status: 201,
    description: "Experience entry created",
    type: ExperienceResponseDto,
  })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createExperience(
    @Body() createExperienceDto: CreateExperienceDto,
  ): Promise<ExperienceResponseDto> {
    return this.experienceService.createExperience(createExperienceDto);
  }

  /**
   * PUT /api/v1/experience/:id
   * Update an experience entry (admin only)
   * Requires authentication and ADMIN role
   */
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update an experience entry (admin only)" })
  @ApiParam({
    name: "id",
    description: "Experience ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  @ApiResponse({
    status: 200,
    description: "Experience entry updated",
    type: ExperienceResponseDto,
  })
  @ApiResponse({ status: 404, description: "Experience entry not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async updateExperience(
    @Param("id") id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ): Promise<ExperienceResponseDto> {
    return this.experienceService.updateExperience(id, updateExperienceDto);
  }

  /**
   * DELETE /api/v1/experience/:id
   * Delete an experience entry (admin only)
   * Requires authentication and ADMIN role
   */
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete an experience entry (admin only)" })
  @ApiParam({
    name: "id",
    description: "Experience ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  @ApiResponse({ status: 204, description: "Experience entry deleted" })
  @ApiResponse({ status: 404, description: "Experience entry not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async deleteExperience(@Param("id") id: string): Promise<void> {
    await this.experienceService.deleteExperience(id);
  }
}
