// ============================================
// PROFILE SERVICE - Business Logic
// ============================================
// This service handles all database operations for profiles
// It's injected into the controller and used by other modules

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfileResponseDto } from "./dto/profile-response.dto";

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get a profile by user ID
   * @param userId - The ID of the user
   * @returns The profile data
   * @throws NotFoundException if profile doesn't exist
   */
  async getProfileByUserId(userId: string): Promise<ProfileResponseDto> {
    // Find the profile associated with this user
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    // If no profile exists, throw a 404 error
    if (!profile) {
      throw new NotFoundException("Profile not found for this user");
    }

    // Return the profile data
    return profile;
  }

  /**
   * Create a new profile for a user
   * @param userId - The ID of the user
   * @param data - Profile data to create
   * @returns The created profile
   * @throws ForbiddenException if profile already exists
   */
  async createProfile(
    userId: string,
    data: CreateProfileDto,
  ): Promise<ProfileResponseDto> {
    // Check if a profile already exists for this user
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    // If profile exists, prevent duplicate creation
    if (existingProfile) {
      throw new ForbiddenException("User already has a profile");
    }

    // Create the profile in the database
    const profile = await this.prisma.profile.create({
      data: {
        userId,
        ...data,
      },
    });

    return profile;
  }

  /**
   * Update an existing profile
   * @param userId - The ID of the user
   * @param data - Profile data to update
   * @returns The updated profile
   * @throws NotFoundException if profile doesn't exist
   */
  async updateProfile(
    userId: string,
    data: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    // First, check if the profile exists
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    // If no profile exists, throw a 404 error
    if (!existingProfile) {
      throw new NotFoundException("Profile not found");
    }

    // Update the profile with new data
    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data,
    });

    return updatedProfile;
  }

  /**
   * Get public profile (no authentication required)
   * @param userId - The ID of the user
   * @returns The profile data
   * @throws NotFoundException if profile doesn't exist
   */
  async getPublicProfile(userId: string): Promise<ProfileResponseDto> {
    // Find the profile
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    // If no profile exists, throw a 404 error
    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    return profile;
  }
}
