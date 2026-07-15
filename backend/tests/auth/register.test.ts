import supertest from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../src/app.ts";
import { RegisterType } from "@lankaStay/shared/schemes/user/registerSchema.ts";
import { ApiResponse } from "@lankaStay/shared/utils/ApiResponse.ts";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema.ts";
const api = supertest(app);
describe("POST /api/auth/register", () => {
  it("should return 201 when registering a new user", async () => {
    const registerBody: RegisterType = {
      email: "qPnOo@example.com",
      password: "password",
      firstName: "John",
      lastName: "Doe",
      confirmPassword: "password",
    };
    const response = await api.post("/api/auth/register").send(registerBody);
    const responseBody = response.body as ApiResponse<{
      user: UserResponseType;
      accessToken: string;
    }>;
    expect(response.status).toBe(201);
    expect(responseBody.message).toBe("User registered successfully");
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(responseBody.data.user.email).toBe(registerBody.email);
    expect(responseBody.data.user).not.haveOwnProperty("password");
    expect(Object.keys(responseBody.data)).toEqual(["accessToken", "user"]);
  });
  it("should return 409 when email already exists", async () => {
    const registerBody: RegisterType = {
      email: "somebody@example.com",
      password: "password",
      firstName: "John",
      lastName: "Doe",
      confirmPassword: "password",
    };
    await api.post("/api/auth/register").send(registerBody);
    const response = await api.post("/api/auth/register").send(registerBody);
    const responseBody = response.body as ApiResponse<RegisterType>;
    expect(response.status).toBe(409);
    expect(responseBody.message).toBe("email already exists");
  });
});
