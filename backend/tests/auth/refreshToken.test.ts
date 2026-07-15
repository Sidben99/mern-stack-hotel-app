import supertest from "supertest";
import { vi, describe, it, expect } from "vitest";
import app from "../../src/app.ts";
import { RegisterType } from "@lankaStay/shared/schemes/user/registerSchema.ts";
import { ApiResponse } from "@lankaStay/shared/utils/ApiResponse.ts";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema.ts";
import { createToken } from "../../src/helpers/createVerifyToken.ts";
import { getEnv } from "../../src/conf/env.conf.ts";
const api = supertest.agent(app);
describe("POST /api/auth/refresh-token", () => {
  it("should return 401 when no token is provided", async () => {
    const response = await api.post("/api/auth/refresh-token");
    const responseBody = response.body as ApiResponse;
    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("unauthorized user");
  });
  it("should return 401 when token is expired", async () => {
    const envs = getEnv();
    const token = createToken({}, envs.REFRESH_TOKEN_SECRET, 0);
    const response = await api
      .post("/api/auth/refresh-token")
      .set("Cookie", [`refreshToken=${token}`]);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("token expired");
  });
  it("should return 401 when token is invalid", async () => {
    const envs = getEnv();
    const token = createToken({}, "secret", envs.REFRESH_TOKEN_LIFETIME);
    const response = await api
      .post("/api/auth/refresh-token")
      .set("Cookie", [`refreshToken=${token}`]);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("invalid token");
  });
  it("should return 201 when refreshing a valid token", async () => {
    const registerBody: RegisterType = {
      email: "cookietest@example.com",
      password: "password",
      firstName: "Cookie",
      lastName: "Test",
      confirmPassword: "password",
    };
    await api.post("/api/auth/register").send(registerBody);
    const refreshRes = await api.post("/api/auth/refresh-token");
    const refreshResBody = refreshRes.body as ApiResponse<{
      user: UserResponseType;
      accessToken: string;
    }>;
    expect(refreshRes.status).toBe(201);
    expect(refreshResBody.data.accessToken).toBeDefined();
    expect(refreshResBody.data.user).toBeDefined();
  });
});
