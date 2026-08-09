# Profile Module

## Overview

Manages user profiles for the portfolio website.

## API Endpoints

| Method | Endpoint                         | Auth      | Description                   |
| ------ | -------------------------------- | --------- | ----------------------------- |
| GET    | `/api/v1/profile`                | ✅ JWT    | Get current user's profile    |
| POST   | `/api/v1/profile`                | ✅ JWT    | Create a new profile          |
| PUT    | `/api/v1/profile`                | ✅ JWT    | Update current user's profile |
| GET    | `/api/v1/profile/public/:userId` | ❌ Public | Get public profile            |

## DTOs

- `CreateProfileDto` - Validation for profile creation
- `UpdateProfileDto` - Validation for profile updates
- `ProfileResponseDto` - Standard response format
