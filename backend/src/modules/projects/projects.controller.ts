// ============================================
// PROJECTS CONTROLLER - API Endpoints
// ============================================
// This controller handles all HTTP requests related to projects
// Public endpoints: GET (view projects)
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
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectResponseDto } from "./dto/project-response.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { Role } from "@prisma/client";

@ApiTags("Projects")
@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * GET /api/v1/projects
   * Get all published projects (public)
   * This endpoint is accessible without authentication
   */
  @Get()
  @Public()
  @ApiOperation({ summary: "Get all published projects (public)" })
  @ApiResponse({
    status: 200,
    description: "List of all published projects",
    type: [ProjectResponseDto],
  })
  async getAllProjects(): Promise<ProjectResponseDto[]> {
    return this.projectsService.getAllProjects();
  }

  /**
   * GET /api/v1/projects/admin
   * Get all projects including unpublished (admin only)
   * This endpoint requires authentication and ADMIN role
   */
  @Get("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get all projects including unpublished (admin only)",
  })
  @ApiResponse({
    status: 200,
    description: "List of all projects",
    type: [ProjectResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getAllProjectsAdmin(): Promise<ProjectResponseDto[]> {
    return this.projectsService.getAllProjectsAdmin();
  }

  /**
   * GET /api/v1/projects/featured
   * Get featured projects for the homepage (public)
   * Accessible without authentication
   */
  @Get("featured")
  @Public()
  @ApiOperation({ summary: "Get featured projects (public)" })
  @ApiResponse({
    status: 200,
    description: "List of featured projects",
    type: [ProjectResponseDto],
  })
  async getFeaturedProjects(): Promise<ProjectResponseDto[]> {
    return this.projectsService.getFeaturedProjects();
  }

  /**
   * GET /api/v1/projects/slug/:slug
   * Get a project by its slug (public)
   * Example: /api/v1/projects/slug/my-awesome-project
   */
  @Get("slug/:slug")
  @Public()
  @ApiOperation({ summary: "Get project by slug (public)" })
  @ApiParam({
    name: "slug",
    description: "Project slug (URL-friendly identifier)",
    example: "my-awesome-project",
  })
  @ApiResponse({
    status: 200,
    description: "Project found",
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 404, description: "Project not found" })
  async getProjectBySlug(
    @Param("slug") slug: string,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.getProjectBySlug(slug);
  }

  /**
   * GET /api/v1/projects/:id
   * Get a project by its ID (public if published, admin only if unpublished)
   * This endpoint is public but returns 404 if project is unpublished
   */
  @Get(":id")
  @Public()
  @ApiOperation({ summary: "Get project by ID (public - only published)" })
  @ApiParam({
    name: "id",
    description: "Project ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  @ApiResponse({
    status: 200,
    description: "Project found",
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 404, description: "Project not found" })
  async getProjectById(@Param("id") id: string): Promise<ProjectResponseDto> {
    // This will only return published projects
    // For admin access to unpublished, use the admin endpoint
    return this.projectsService.getProjectById(id);
  }

  /**
   * POST /api/v1/projects
   * Create a new project (admin only)
   * Requires authentication and ADMIN role
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create a new project (admin only)" })
  @ApiResponse({
    status: 201,
    description: "Project created",
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 409, description: "Slug already exists" })
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.createProject(createProjectDto);
  }

  /**
   * PUT /api/v1/projects/:id
   * Update a project (admin only)
   * Requires authentication and ADMIN role
   */
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update a project (admin only)" })
  @ApiParam({
    name: "id",
    description: "Project ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  @ApiResponse({
    status: 200,
    description: "Project updated",
    type: ProjectResponseDto,
  })
  @ApiResponse({ status: 404, description: "Project not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async updateProject(
    @Param("id") id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.updateProject(id, updateProjectDto);
  }

  /**
   * DELETE /api/v1/projects/:id
   * Delete a project (admin only)
   * Requires authentication and ADMIN role
   */
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete a project (admin only)" })
  @ApiParam({
    name: "id",
    description: "Project ID",
    example: "cls6x4v9p1111v8q7b2c3d4e5",
  })
  @ApiResponse({ status: 204, description: "Project deleted" })
  @ApiResponse({ status: 404, description: "Project not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async deleteProject(@Param("id") id: string): Promise<void> {
    await this.projectsService.deleteProject(id);
  }
}
