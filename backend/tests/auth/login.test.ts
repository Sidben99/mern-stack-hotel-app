import supertest from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../src/app.ts";
import { LoginType } from "@lankaStay/shared/schemes/user/loginSchema.ts";
import { RegisterType } from "@lankaStay/shared/schemes/user/registerSchema.ts";
import { ApiResponse } from "@lankaStay/shared/utils/ApiResponse.ts";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema.ts";
const api = supertest(app);
describe("POST /api/auth/login", () => {
  it("should return 200 when logging in successfully", async () => {
    const loginBody: LoginType = {
      email: "something@example.com",
      password: "password",
    };
    const registerBody: RegisterType = {
      email: "something@example.com",
      password: "password",
      firstName: "John",
      lastName: "Doe",
      confirmPassword: "password",
    };
    await api.post("/api/auth/register").send(registerBody);
    const response = await api.post("/api/auth/login").send(loginBody);
    const responseBody = response.body as ApiResponse<{
      user: UserResponseType;
      accessToken: string;
    }>;
    expect(response.status).toBe(200);
    expect(responseBody.message).toBe("User logged in successfully");
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(responseBody.data.user.email).toBe(loginBody.email);
    expect(responseBody.data.user).not.haveOwnProperty("password");
    expect(Object.keys(responseBody.data)).toEqual(["accessToken", "user"]);
  });
  it("should return 401 when user is not found", async () => {
    const loginBody: LoginType = {
      email: "something@example.com",
      password: "password",
    };
    const response = await api.post("/api/auth/login").send(loginBody);
    const responseBody = response.body as ApiResponse<{
      user: UserResponseType;
      accessToken: string;
    }>;
    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("invalid credentials");
  });
  it("should return 401 when credentials do not match", async () => {
    const loginBody: LoginType = {
      email: "something@example.com",
      password: "password",
    };
    const registerBody: RegisterType = {
      email: "something@example.com",
      password: "anotherPassword",
      firstName: "John",
      lastName: "Doe",
      confirmPassword: "anotherPassword",
    };
    await api.post("/api/auth/register").send(registerBody);
    const response = await api.post("/api/auth/login").send(loginBody);
    const responseBody = response.body as ApiResponse<{
      user: UserResponseType;
      accessToken: string;
    }>;
    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("invalid credentials");
  });
});
