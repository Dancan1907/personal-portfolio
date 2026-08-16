// ============================================
// EDUCATION CONTROLLER - API Endpoints
// ============================================
// This controller handles all HTTP requests related to education
// Public endpoints: GET (view education)
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
import { EducationService } from "./education.service";
import { CreateEducationDto } from "./dto/create-education.dto";
import { UpdateEducationDto } from "./dto/update-education.dto";
import { EducationResponseDto } from "./dto/education-response.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Role } from "@prisma/client";

@ApiTags("Education")
@Controller("education")
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  /**
   * GET /api/v1/education
   * Get all education entries (public)
   * This endpoint is accessible without authentication
   */
  @Get()
  @Public()
  @ApiOperation({ summary: "Get all education entries (public)" })
  @ApiResponse({
    status: 200,
    description: "List of all education entries sorted by date (newest first)",
    type: [EducationResponseDto],
  })
  async getAllEducation(): Promise<EducationResponseDto[]> {
    return this.educationService.getAllEducation();
  }

  /**
   * GET /api/v1/education/:id
   * Get a single education entry by ID (public)
   * This endpoint is accessible without authentication
   */
  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get education entry by ID (public)" })
  @ApiParam({
    name: "id",
    description: "Education ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  @ApiResponse({
    status: 200,
    description: "Education entry found",
    type: EducationResponseDto,
  })
  @ApiResponse({ status: 404, description: "Education entry not found" })
  async getEducationById(
    @Param("id") id: string,
  ): Promise<EducationResponseDto> {
    return this.educationService.getEducationById(id);
  }

  /**
   * POST /api/v1/education
   * Create a new education entry (admin only)
   * Requires authentication and ADMIN role
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create a new education entry (admin only)" })
  @ApiResponse({
    status: 201,
    description: "Education entry created",
    type: EducationResponseDto,
  })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async createEducation(
    @Body() createEducationDto: CreateEducationDto,
  ): Promise<EducationResponseDto> {
    return this.educationService.createEducation(createEducationDto);
  }

  /**
   * PUT /api/v1/education/:id
   * Update an education entry (admin only)
   * Requires authentication and ADMIN role
   */
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update an education entry (admin only)" })
  @ApiParam({
    name: "id",
    description: "Education ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  @ApiResponse({
    status: 200,
    description: "Education entry updated",
    type: EducationResponseDto,
  })
  @ApiResponse({ status: 404, description: "Education entry not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async updateEducation(
    @Param("id") id: string,
    @Body() updateEducationDto: UpdateEducationDto,
  ): Promise<EducationResponseDto> {
    return this.educationService.updateEducation(id, updateEducationDto);
  }

  /**
   * DELETE /api/v1/education/:id
   * Delete an education entry (admin only)
   * Requires authentication and ADMIN role
   */
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete an education entry (admin only)" })
  @ApiParam({
    name: "id",
    description: "Education ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  @ApiResponse({ status: 204, description: "Education entry deleted" })
  @ApiResponse({ status: 404, description: "Education entry not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async deleteEducation(@Param("id") id: string): Promise<void> {
    await this.educationService.deleteEducation(id);
  }
}
