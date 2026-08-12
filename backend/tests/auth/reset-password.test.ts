import supertest from "supertest";
import { vi, describe, it, expect } from "vitest";
import app from "../../src/app.ts";
import { createToken } from "../../src/helpers/createVerifyToken.ts";
import { getEnv } from "../../src/conf/env.conf.ts";
import { UserModel } from "../../src/models/User.model.ts";
import { sendEmail } from "../../src/helpers/sendEmail.ts";
import { registerTestUser } from "./helper.ts";
vi.mock("../../src/helpers/sendEmail.ts");
const api = supertest(app);
const envs = getEnv();
describe("POST /api/auth/reset-password", () => {
  it("should return 400 when password is too short", async () => {
    const password = "12";
    const response = await api
      .post(`/api/auth/reset-password?token=token`)
      .send({ password });
    console.log("response.body from reset-password test : ", response.body);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("validation error");
    expect(response.body.details.password).toBe(
      "password must be at least 6 characters long",
    );
  });
  it("should return 401 when token is expired", async () => {
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
    const { registerResponseBody } = await registerTestUser(api);
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
    const { registerResponseBody } = await registerTestUser(api);

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
    const { registerResponseBody } = await registerTestUser(api);
    await api
      .post("/api/auth/forget-password")
      .send({ email: registerResponseBody.data.user.email });
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
