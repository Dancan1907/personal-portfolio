// ============================================
// PROFILE CONTROLLER - API Endpoints
// ============================================
// This controller handles all HTTP requests related to profiles
// All routes are protected with JWT authentication (except public ones)

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

@ApiTags("Profile")
@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * GET /api/v1/profile
   * Get the current user's profile
   * Requires authentication
   */
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
  async getProfile(@Request() req): Promise<ProfileResponseDto> {
    // req.user is populated by JwtAuthGuard
    // It contains the user data from the JWT token
    return this.profileService.getProfileByUserId(req.user.id);
  }

  /**
   * POST /api/v1/profile
   * Create a new profile for the current user
   * Requires authentication
   */
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
    @Request() req,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profileService.createProfile(req.user.id, createProfileDto);
  }

  /**
   * PUT /api/v1/profile
   * Update the current user's profile
   * Requires authentication
   */
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
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profileService.updateProfile(req.user.id, updateProfileDto);
  }

  /**
   * GET /api/v1/profile/public/:userId
   * Get a user's public profile (no authentication required)
   * This is used for the public portfolio website
   */
  @Get("public/:userId")
  @Public() // This decorator bypasses JWT authentication
  @ApiOperation({ summary: "Get public profile (no auth required)" })
  @ApiParam({
    name: "userId",
    description: "ID of the user",
    example: "cls5x3v8p0000v8q7a1b2c3d4",
  })
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
