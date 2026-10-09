// backend/src/modules/auth/auth.controller.integration.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import * as bcrypt from "bcrypt";
import { AppModule } from "../../app.module";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";
import { Logger } from "nestjs-pino";
import { cleanTestDB, setupTestDB } from "../../../test/db-helper";

const mockEmailService = {
  sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
};

const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

describe("AuthController (Integration)", () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    await setupTestDB();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue(mockEmailService)
      .overrideProvider(Logger)
      .useValue(mockLogger)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix("api/v1");

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
    console.log("✅ App initialized (with mocks)");
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
      console.log("✅ App closed");
    }
  }, 5000);

  beforeEach(async () => {
    await cleanTestDB();
  }, 15000);

  describe("POST /api/v1/auth/register", () => {
    // Registration is permanently disabled in the controller.
    // The handler always throws UnauthorizedException, so the only
    // meaningful assertions are (a) it rejects with 401 and (b) input
    // validation still runs before the handler.
    it("should reject registration with 401 (registration is disabled)", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/register")
        .send({
          email: "integration-test@example.com",
          password: "Password123!",
          name: "Integration Test",
        })
        .expect(401);
    });

    it("should return 400 for invalid email", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/register")
        .send({
          email: "not-an-email",
          password: "Password123!",
          name: "Test User",
        })
        .expect(400);
    });

    it("should return 400 for short password", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/register")
        .send({
          email: "test@example.com",
          password: "short",
          name: "Test User",
        })
        .expect(400);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("Password123!", 10);
      await prismaService.user.upsert({
        where: { email: "login-test@example.com" },
        update: {
          password: hashedPassword,
          name: "Login Test",
          emailVerified: true,
          isActive: true,
          role: "USER",
        },
        create: {
          email: "login-test@example.com",
          password: hashedPassword,
          name: "Login Test",
          emailVerified: true,
          isActive: true,
          role: "USER",
        },
      });
    }, 10000);

    it("should login successfully with valid credentials", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send({
          email: "login-test@example.com",
          password: "Password123!",
        })
        .expect(201);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe("login-test@example.com");
      expect(response.body.user.emailVerified).toBe(true);
      expect(response.body.access_token).toBeDefined();
      expect(response.body.refresh_token).toBeDefined();
    });

    it("should return 401 for invalid password", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send({
          email: "login-test@example.com",
          password: "WrongPassword!",
        })
        .expect(401);
    });

    it("should return 401 for unverified email", async () => {
      const hashedPassword = await bcrypt.hash("Password123!", 10);
      await prismaService.user.upsert({
        where: { email: "unverified@example.com" },
        update: {
          password: hashedPassword,
          name: "Unverified User",
          emailVerified: false,
          isActive: true,
          role: "USER",
        },
        create: {
          email: "unverified@example.com",
          password: hashedPassword,
          name: "Unverified User",
          emailVerified: false,
          isActive: true,
          role: "USER",
        },
      });

      await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send({
          email: "unverified@example.com",
          password: "Password123!",
        })
        .expect(401);
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    const email = "refresh-test@example.com";
    const password = "Password123!";

    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prismaService.user.upsert({
        where: { email },
        update: {
          password: hashedPassword,
          name: "Refresh Test",
          emailVerified: true,
          isActive: true,
          role: "USER",
        },
        create: {
          email,
          password: hashedPassword,
          name: "Refresh Test",
          emailVerified: true,
          isActive: true,
          role: "USER",
        },
      });
    }, 10000);

    it("should refresh tokens successfully", async () => {
      // Login inside the test (not in beforeEach) so this test performs
      // exactly one login call. The login route is throttled at 5/min,
      // and having beforeEach log in on top of the login-block tests
      // pushed the suite over the limit, producing a 429 that left
      // refreshToken undefined.
      const loginResponse = await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send({ email, password })
        .expect(201);

      const refreshToken = loginResponse.body.refresh_token as string;

      // Sanity checks: catch a broken login response before the actual
      // refresh assertion, so the failure points at login, not refresh.
      expect(typeof refreshToken).toBe("string");
      expect(refreshToken.length).toBeGreaterThan(20);

      const response = await request(app.getHttpServer())
        .post("/api/v1/auth/refresh")
        .send({ refresh_token: refreshToken })
        .expect(201);

      expect(response.body.access_token).toBeDefined();
      expect(response.body.refresh_token).toBeDefined();
      expect(response.body.refresh_token).not.toBe(refreshToken);
    });

    it("should return 401 for invalid refresh token", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/refresh")
        .send({
          refresh_token: "invalid-token",
        })
        .expect(401);
    });
  });
});
