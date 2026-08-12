import supertest from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../src/app.ts";
import { LoginType } from "@lankaStay/shared/schemes/user/loginSchema.ts";
import { ApiResponse } from "@lankaStay/shared/utils/ApiResponse.ts";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema.ts";
import { registerTestUser, getCookieFromJar } from "./helper.ts";
const api = supertest(app);

describe("POST /api/auth/login", () => {
  it("should return 200 when logging in successfully", async () => {
    const api = supertest.agent(app);
    const loginBody: LoginType = {
      email: `something-${Date.now()}@example.com`,
      password: "password",
    };
    await registerTestUser(api, loginBody);
    const response = await api.post("/api/auth/login").send(loginBody);
    const responseBody = response.body as ApiResponse<{
      user: UserResponseType;
      accessToken: string;
    }>;
    const cookie = getCookieFromJar(api);
    expect(response.status).toBe(200);
    expect(responseBody.message).toBe("User logged in successfully");
    expect(responseBody.data.user.email).toBe(loginBody.email);
    expect(responseBody.data.user).not.haveOwnProperty("password");
    expect(Object.keys(responseBody.data)).toEqual(["accessToken", "user"]);
    expect(cookie).toBeDefined();
  });
  it("should return 401 when user is not found", async () => {
    const loginBody: LoginType = {
      email: `notFound-${Date.now()}@example.com`,
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
  it("should return 401 when for incorrect password", async () => {
    const loginBody: LoginType = {
      email: `something-${Date.now()}@example.com`,
      password: "something",
    };

    await registerTestUser(api, {
      email: loginBody.email,
    });
    const response = await api.post("/api/auth/login").send(loginBody);
    const responseBody = response.body as ApiResponse<{
      user: UserResponseType;
      accessToken: string;
    }>;
    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("invalid credentials");
  });
});
