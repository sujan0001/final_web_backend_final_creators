const request = require("supertest");
const app = require("../index");
const User = require("../models/UserModels");
const mongoose = require("mongoose");

let authToken;
let creatorToken;

// Setup test database
beforeAll(async () => {
  // Connect to test database
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/sujan_backend_test');
  }
  
  // Clear test data
  await User.deleteMany({});
});

// Cleanup after all tests
afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("User Authentication API", () => {
  
  test("should validate required fields when registering a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        firstName: "Test",
        email: "testuser@gmail.com",
        // Missing lastName and password
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Missing required fields");
  });

  test("should register a user with all required fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        firstName: "Test",
        lastName: "User",
        email: "testuser@gmail.com",
        password: "password123",
        role: "consumer"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User registered successfully");
  });

  test("should register a creator user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        firstName: "Creator",
        lastName: "User",
        email: "creator@gmail.com",
        password: "password123",
        role: "creator"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User registered successfully");
  });

  test("should not register user with duplicate email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        firstName: "Duplicate",
        lastName: "User",
        email: "testuser@gmail.com", // Same email as first test
        password: "password123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User already exists");
  });

  test("should login user with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@gmail.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.email).toBe("testuser@gmail.com");
    
    // Save token for authenticated tests
    authToken = res.body.token;
  });

  test("should login creator with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "creator@gmail.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.role).toBe("creator");
    
    // Save creator token for authenticated tests
    creatorToken = res.body.token;
  });

  test("should reject login with missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@gmail.com",
        // Missing password
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Missing email or password");
  });

  test("should reject login with non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "nonexistent@gmail.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found or account deactivated");
  });

  test("should reject login with invalid password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@gmail.com",
        password: "wrongpassword",
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid credentials");
  });

  test("should get all creators", async () => {
    const res = await request(app)
      .get("/api/auth/GetAllCreators")
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    
    // Check if creator exists in the list
    const creator = res.body.data.find(user => user.email === "creator@gmail.com");
    expect(creator).toBeDefined();
  });

  test("should send reset password link", async () => {
    const res = await request(app)
      .post("/api/auth/request-reset")
      .send({
        email: "testuser@gmail.com"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Reset email sent");
  });

  test("should reject reset for non-existent user", async () => {
    const res = await request(app)
      .post("/api/auth/request-reset")
      .send({
        email: "nonexistent@gmail.com"
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });
});