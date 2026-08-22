// ============================================
// SEED SCRIPT - Creates your admin account only
// ============================================
// This script creates ONLY your admin account.
// No demo users are created.
// Credentials are read from .env for security.

import { PrismaClient, Role } from "@prisma/client";
// ✅ REPLACE argon2 with bcrypt
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ============================================
  // GET ADMIN CREDENTIALS FROM ENVIRONMENT
  // ============================================
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Admin User";

  // Validate environment variables
  if (!adminEmail || !adminPassword) {
    console.error("\n❌ ERROR: Missing environment variables!");
    console.error("   Please add these to your backend/.env file:");
    console.error("   ADMIN_EMAIL=your-email@example.com");
    console.error("   ADMIN_PASSWORD=your-password");
    console.error("   ADMIN_NAME=Your Name\n");
    process.exit(1);
  }

  // ============================================
  // CHECK IF ADMIN ALREADY EXISTS
  // ============================================
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`✅ Admin already exists: ${adminEmail}`);
    console.log(`   Role: ${existingAdmin.role}`);
    console.log("   No changes made.");
    console.log("\n✅ Seeding complete!");
    return;
  }

  // ============================================
  // CREATE ADMIN USER
  // ============================================
  // ✅ REPLACE argon2.hash() with bcrypt.hash()
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: Role.ADMIN,
      isActive: true,
      emailVerified: true,
    },
  });

  console.log(`✅ Admin created: ${admin.email}`);
  console.log(`   Role: ${admin.role}`);
  console.log(`   Name: ${admin.name}`);
  console.log("\n🔑 You can now log in with your email and password.");

  console.log("\n✅ Seeding complete!");
}

// ============================================
// EXECUTE SEED WITH ERROR HANDLING
// ============================================
main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
