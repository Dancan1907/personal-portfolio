// ============================================
// PROFILE CONTROLLER - API Endpoints (FIXED)
// ============================================
// All changes: Added proper types for Request parameter
// Request is imported from express

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Request,
  Param,
} from "@nestjs/common";
import { Request as ExpressRequest } from "express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { ProfileService } from "./profile.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfileResponseDto } from "./dto/profile-response.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { Public } from "../../common/decorators/public.decorator";

// Define the user type from the JWT payload
// Matches what JwtStrategy.validate() actually returns: { userId, email, role }
interface RequestWithUser extends ExpressRequest {
  user: {
    userId: string; // ← was `id`, corrected to match JwtStrategy
    email: string;
    role: string;
  };
}

@ApiTags("Profile")
@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({
    status: 200,
    description: "Profile found",
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: "Profile not found" })
  async getProfile(
    @Request() req: RequestWithUser,
  ): Promise<ProfileResponseDto> {
    return this.profileService.getProfileByUserId(req.user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Create user profile" })
  @ApiResponse({
    status: 201,
    description: "Profile created",
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 403, description: "User already has a profile" })
  async createProfile(
    @Request() req: RequestWithUser,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profileService.createProfile(req.user.userId, createProfileDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Update user profile" })
  @ApiResponse({
    status: 200,
    description: "Profile updated",
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: "Profile not found" })
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profileService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Get("public/:userId")
  @Public()
  @ApiOperation({ summary: "Get public profile (no auth required)" })
  @ApiParam({ name: "userId", description: "ID of the user" })
  @ApiResponse({
    status: 200,
    description: "Public profile found",
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: "Profile not found" })
  async getPublicProfile(
    @Param("userId") userId: string,
  ): Promise<ProfileResponseDto> {
    return this.profileService.getPublicProfile(userId);
  }
}
