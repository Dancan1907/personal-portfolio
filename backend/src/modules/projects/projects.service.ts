// ============================================
// PROJECTS SERVICE - Business Logic
// ============================================
// This service handles all database operations for projects
// Includes public viewing and admin CRUD operations

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectResponseDto } from "./dto/project-response.dto";
import { Project } from "@prisma/client";

// Helper function to generate a slug from a title
// Converts "My Awesome Project" → "my-awesome-project"
function generateSlug(title: string): string {
  return title
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]+/g, "-") // Replace special chars with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper: Convert Prisma Project to ProjectResponseDto
   * This ensures consistent response format across all endpoints
   */
  private toProjectResponseDto(project: Project): ProjectResponseDto {
    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description ?? undefined,
      problem: project.problem ?? undefined,
      solution: project.solution ?? undefined,
      challenge: project.challenge ?? undefined,
      lessons: project.lessons ?? undefined,
      techStack: project.techStack ?? undefined,
      features: project.features ?? undefined,
      demoUrl: project.demoUrl ?? undefined,
      githubUrl: project.githubUrl ?? undefined,
      isFeatured: project.isFeatured ?? undefined,
      isPublished: project.isPublished ?? undefined,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  /**
   * Get all published projects
   * @returns Array of all published projects
   */
  async getAllProjects(): Promise<ProjectResponseDto[]> {
    // Only return published projects for public viewing
    // Admin will see all projects via a separate endpoint
    const projects = await this.prisma.project.findMany({
      where: {
        isPublished: true, // Only show published projects
      },
      orderBy: [
        { isFeatured: "desc" }, // Featured projects first
        { createdAt: "desc" }, // Then newest first
      ],
    });

    return projects.map((project) => this.toProjectResponseDto(project));
  }

  /**
   * Get all projects (including unpublished) - Admin only
   * @returns Array of all projects
   */
  async getAllProjectsAdmin(): Promise<ProjectResponseDto[]> {
    const projects = await this.prisma.project.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

    return projects.map((project) => this.toProjectResponseDto(project));
  }

  /**
   * Get featured projects for the homepage
   * @returns Array of featured projects
   */
  async getFeaturedProjects(): Promise<ProjectResponseDto[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        isPublished: true,
        isFeatured: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return projects.map((project) => this.toProjectResponseDto(project));
  }

  /**
   * Get a project by its slug (URL-friendly identifier)
   * @param slug - The project slug
   * @returns The project data
   * @throws NotFoundException if project doesn't exist or is not published
   */
  async getProjectBySlug(slug: string): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.findUnique({
      where: {
        slug,
        isPublished: true, // Only return if published
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with slug "${slug}" not found`);
    }

    return this.toProjectResponseDto(project);
  }

  /**
   * Get a project by its ID (Admin only - can see unpublished)
   * @param id - The project ID
   * @returns The project data
   * @throws NotFoundException if project doesn't exist
   */
  async getProjectById(id: string): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return this.toProjectResponseDto(project);
  }

  /**
   * Create a new project
   * @param data - Project data to create
   * @returns The created project
   * @throws ConflictException if slug already exists
   */
  async createProject(data: CreateProjectDto): Promise<ProjectResponseDto> {
    // Generate a slug from the title if not provided
    let slug = data.slug;
    if (!slug && data.title) {
      slug = generateSlug(data.title);
    }

    // Ensure slug is unique
    if (slug) {
      const existing = await this.prisma.project.findUnique({
        where: { slug },
      });

      if (existing) {
        // If slug exists, append a random suffix to make it unique
        const suffix = Math.random().toString(36).substring(2, 6);
        slug = `${slug}-${suffix}`;
      }
    } else {
      throw new BadRequestException("Either title or slug must be provided");
    }

    // Create the project in the database
    const project = await this.prisma.project.create({
      data: {
        title: data.title,
        slug: slug,
        description: data.description,
        problem: data.problem,
        solution: data.solution,
        challenge: data.challenge,
        lessons: data.lessons,
        techStack: data.techStack || [],
        features: data.features || [],
        demoUrl: data.demoUrl,
        githubUrl: data.githubUrl,
        isFeatured: data.isFeatured ?? false,
        isPublished: data.isPublished ?? true,
      },
    });

    return this.toProjectResponseDto(project);
  }

  /**
   * Update an existing project
   * @param id - The project ID
   * @param data - Project data to update
   * @returns The updated project
   * @throws NotFoundException if project doesn't exist
   */
  async updateProject(
    id: string,
    data: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    // Check if project exists
    const existingProject = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // If title is being updated, also update the slug
    let slug = data.slug;
    if (!slug && data.title) {
      slug = generateSlug(data.title);
    }

    // Build update data object
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (slug) updateData.slug = slug;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.problem !== undefined) updateData.problem = data.problem;
    if (data.solution !== undefined) updateData.solution = data.solution;
    if (data.challenge !== undefined) updateData.challenge = data.challenge;
    if (data.lessons !== undefined) updateData.lessons = data.lessons;
    if (data.techStack !== undefined) updateData.techStack = data.techStack;
    if (data.features !== undefined) updateData.features = data.features;
    if (data.demoUrl !== undefined) updateData.demoUrl = data.demoUrl;
    if (data.githubUrl !== undefined) updateData.githubUrl = data.githubUrl;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.isPublished !== undefined)
      updateData.isPublished = data.isPublished;

    const updatedProject = await this.prisma.project.update({
      where: { id },
      data: updateData,
    });

    return this.toProjectResponseDto(updatedProject);
  }

  /**
   * Delete a project (hard delete)
   * @param id - The project ID
   * @throws NotFoundException if project doesn't exist
   */
  async deleteProject(id: string): Promise<void> {
    // Check if project exists
    const existingProject = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Delete the project
    await this.prisma.project.delete({
      where: { id },
    });
  }
}
