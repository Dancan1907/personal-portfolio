// ============================================
// PRISMA SERVICE - Database Access Layer
// ============================================
// This service provides database access via Prisma.
// Uses composition instead of inheritance to avoid
// "Class constructor cannot be invoked without 'new'" error.

import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // ✅ Use composition: store PrismaClient as a property
  private prisma: PrismaClient;

  constructor() {
    // ✅ Initialize PrismaClient in the constructor
    this.prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "info", "warn", "error"]
          : ["error"],
    });

    // ✅ Add middleware after initialization
    this.prisma.$use(async (params, next) => {
      if (params.model === "User" && params.action === "findMany") {
        params.args.where = { ...params.args.where, deletedAt: null };
      }
      return next(params);
    });
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  // ============================================
  // DELEGATE ALL PRISMA METHODS
  // ============================================
  // This allows the service to be used just like a PrismaClient instance

  get user() {
    return this.prisma.user;
  }

  get profile() {
    return this.prisma.profile;
  }

  get skill() {
    return this.prisma.skill;
  }

  get project() {
    return this.prisma.project;
  }

  get projectImage() {
    return this.prisma.projectImage;
  }

  get experience() {
    return this.prisma.experience;
  }

  get education() {
    return this.prisma.education;
  }

  get contactMessage() {
    return this.prisma.contactMessage;
  }

  get auditLog() {
    return this.prisma.auditLog;
  }

  // ============================================
  // TRANSACTION SUPPORT
  // ============================================

  // ✅ FIX: Use the correct type signature for Prisma transactions
  async $transaction<T>(
    fn: (
      prisma: Omit<
        PrismaClient,
        | "$connect"
        | "$disconnect"
        | "$on"
        | "$transaction"
        | "$use"
        | "$extends"
      >,
    ) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(fn);
  }

  // ============================================
  // RAW QUERY SUPPORT (optional - remove if not used)
  // ============================================

  // If you don't use raw queries, you can remove this method
  // async $queryRaw<T = unknown>(
  //   strings: TemplateStringsArray,
  //   ...values: any[]
  // ): Promise<T> {
  //   return this.prisma.$queryRaw<T>(strings, ...values);
  // }
}
