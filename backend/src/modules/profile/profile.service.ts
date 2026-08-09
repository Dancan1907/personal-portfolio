// ============================================
// PROFILE SERVICE - Business Logic (FIXED)
// ============================================
// Added helper method to convert null to undefined
// Fixed type compatibility issues

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfileResponseDto } from "./dto/profile-response.dto";
import { Profile } from "@prisma/client";

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper: Convert Prisma Profile (with nulls) to ProfileResponseDto (with undefineds)
   * This is needed because Prisma returns null for optional fields
   * but our DTO expects undefined
   */
  private toProfileResponseDto(profile: Profile): ProfileResponseDto {
    return {
      id: profile.id,
      name: profile.name,
      title: profile.title ?? undefined, // null → undefined
      bio: profile.bio ?? undefined,
      avatarUrl: profile.avatarUrl ?? undefined,
      resumeUrl: profile.resumeUrl ?? undefined,
      githubUrl: profile.githubUrl ?? undefined,
      linkedinUrl: profile.linkedinUrl ?? undefined,
      twitterUrl: profile.twitterUrl ?? undefined,
      websiteUrl: profile.websiteUrl ?? undefined,
      email: profile.email ?? undefined,
      location: profile.location ?? undefined,
      phone: profile.phone ?? undefined,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  async getProfileByUserId(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException("Profile not found for this user");
    }

    return this.toProfileResponseDto(profile);
  }

  async createProfile(
    userId: string,
    data: CreateProfileDto,
  ): Promise<ProfileResponseDto> {
    // Check if profile already exists
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ForbiddenException("User already has a profile");
    }

    // Create the profile - name is now required so it's always provided
    const profile = await this.prisma.profile.create({
      data: {
        userId,
        name: data.name, // ← Now required
        title: data.title,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        resumeUrl: data.resumeUrl,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        twitterUrl: data.twitterUrl,
        websiteUrl: data.websiteUrl,
        email: data.email,
        location: data.location,
        phone: data.phone,
      },
    });

    return this.toProfileResponseDto(profile);
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new NotFoundException("Profile not found");
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data: {
        // Only include fields that are provided
        ...(data.name !== undefined && { name: data.name }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        ...(data.resumeUrl !== undefined && { resumeUrl: data.resumeUrl }),
        ...(data.githubUrl !== undefined && { githubUrl: data.githubUrl }),
        ...(data.linkedinUrl !== undefined && {
          linkedinUrl: data.linkedinUrl,
        }),
        ...(data.twitterUrl !== undefined && { twitterUrl: data.twitterUrl }),
        ...(data.websiteUrl !== undefined && { websiteUrl: data.websiteUrl }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.phone !== undefined && { phone: data.phone }),
      },
    });

    return this.toProfileResponseDto(updatedProfile);
  }

  async getPublicProfile(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    return this.toProfileResponseDto(profile);
  }
}
