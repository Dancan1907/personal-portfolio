// backend/test/factories/user.factory.ts
import { Role } from "@prisma/client";
import * as bcrypt from "bcrypt"; // ✅ REPLACE argon2 with bcrypt

export interface CreateUserOptions {
  email?: string;
  password?: string;
  name?: string;
  role?: Role;
  isActive?: boolean;
  emailVerified?: boolean;
}

export async function createTestUser(options: CreateUserOptions = {}) {
  const {
    email = `test-${Date.now()}@example.com`,
    password = "Password123!",
    name = "Test User",
    role = Role.USER,
    isActive = true,
    emailVerified = false,
  } = options;

  const hashedPassword = await bcrypt.hash(password, 10); // ✅ bcrypt

  return {
    email,
    password,
    hashedPassword,
    name,
    role,
    isActive,
    emailVerified,
  };
}

export function createMockUser(overrides = {}) {
  return {
    id: "test-user-id",
    email: "test@example.com",
    password: "hashed-password",
    name: "Test User",
    avatar: null,
    role: Role.USER,
    isActive: true,
    emailVerified: false,
    refreshToken: null,
    verificationToken: null,
    verificationTokenExpiry: null,
    resetToken: null,
    resetTokenExpiry: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
