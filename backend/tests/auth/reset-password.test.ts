import supertest from "supertest";
import { vi, describe, it, expect } from "vitest";
import app from "../../src/app.ts";
import { RegisterType } from "@lankaStay/shared/schemes/user/registerSchema.ts";
import { ApiResponse } from "@lankaStay/shared/utils/ApiResponse.ts";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema.ts";
import { createToken } from "../../src/helpers/createVerifyToken.ts";
import { getEnv } from "../../src/conf/env.conf.ts";
import { UserModel } from "../../src/models/User.model.ts";
import { sendEmail } from "../../src/helpers/sendEmail.ts";
vi.mock("../../src/helpers/sendEmail.ts");
const api = supertest(app);
describe("POST /api/auth/reset-password", () => {
  it("should return 400 when password is too short", async () => {
    const password = "p";
    const response = await api
      .post("/api/auth/reset-password")
      .send({ password });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("validation error");
  });
  it("should return 401 when token is expired", async () => {
    const envs = getEnv();
    const token = createToken({}, envs.ACCESS_TOKEN_SECRET, 0);
    const password = "password";
    const response = await api
      .post(`/api/auth/reset-password?token=${token}`)
      .send({ password });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("token expired");
  });
  it("should return 401 when token is invalid", async () => {
    const token = createToken({}, "secret", 0);
    const password = "password";
    const response = await api
      .post(`/api/auth/reset-password?token=${token}`)
      .send({ password });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("invalid token");
  });
  it("should return 404 when user is not found", async () => {
    const envs = getEnv();
    const registerBody: RegisterType = {
      email: "something@example.com",
      password: "password",
      firstName: "John",
      lastName: "Doe",
      confirmPassword: "password",
    };
    const registerResponse = await api
      .post("/api/auth/register")
      .send(registerBody);
    const registerResponseBody = registerResponse.body as ApiResponse<{
      user: UserResponseType;
      accessToken: string;
    }>;

    const token = createToken(
      { sub: registerResponseBody.data.user.id.toString() },
      envs.ACCESS_TOKEN_SECRET,
      envs.ACCESS_TOKEN_LIFETIME,
    );
    const password = "password";
    await UserModel.findByIdAndDelete(registerResponseBody.data.user.id);
    const response = await api
      .post(`/api/auth/reset-password?token=${token}`)
      .send({ password });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("user not found");
  });
  it("should return 200 when password is reset with a valid token", async () => {
    const envs = getEnv();
    const registerBody: RegisterType = {
      email: "something@example.com",
      password: "password",
      firstName: "John",
      lastName: "Doe",
      confirmPassword: "password",
    };
    const registerResponse = await api
      .post("/api/auth/register")
      .send(registerBody);
    const registerResponseBody = registerResponse.body as ApiResponse<{
      user: UserResponseType;
      accessToken: string;
    }>;

    const token = createToken(
      { sub: registerResponseBody.data.user.id.toString() },
      envs.ACCESS_TOKEN_SECRET,
      envs.ACCESS_TOKEN_LIFETIME,
    );
    const password = "password";
    const response = await api
      .post(`/api/auth/reset-password?token=${token}`)
      .send({ password });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("password reset successfully");
  });
  it("should return 200 when password is reset via email flow", async () => {
    const registerBody: RegisterType = {
      email: "something@example.com",
      password: "password",
      firstName: "John",
      lastName: "Doe",
      confirmPassword: "password",
    };
    await api.post("/api/auth/register").send(registerBody);
    // const registerResponseBody = registerResponse.body as ApiResponse<{
    //   user: UserResponseType;
    //   accessToken: string;
    // }>;
    await api
      .post("/api/auth/forget-password")
      .send({ email: registerBody.email });
    const token = vi.mocked(sendEmail).mock.calls[0][2].split("=")[1];
    console.log("token : ", token);
    const password = "password";
    const response = await api
      .post(`/api/auth/reset-password?token=${token}`)
      .send({ password });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("password reset successfully");
  });
});
