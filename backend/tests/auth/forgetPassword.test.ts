import supertest from "supertest";
import { vi, describe, it, expect } from "vitest";
import app from "../../src/app.ts";
import { LoginType } from "@lankaStay/shared/schemes/user/loginSchema.ts";
import { RegisterType } from "@lankaStay/shared/schemes/user/registerSchema.ts";
import { ApiResponse } from "@lankaStay/shared/utils/ApiResponse.ts";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema.ts";
vi.mock("../../src/helpers/sendEmail.ts");
const api = supertest(app);
describe("POST /api/auth/forget-password", () => {
  it("should return 404 when user is not found", async () => {
    const email = "something@example.com";
    const response = await api
      .post("/api/auth/forget-password")
      .send({ email });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("user not found");
  });
  it("should return 400 when email is invalid", async () => {
    const email = "somethingexample.com";
    const response = await api
      .post("/api/auth/forget-password")
      .send({ email });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("validation error");
  });
  it("should return 200 when password reset email is sent", async () => {
    const registerBody: RegisterType = {
      email: "something@example.com",
      password: "password",
      firstName: "John",
      lastName: "Doe",
      confirmPassword: "password",
    };
    await api.post("/api/auth/register").send(registerBody);
    const email = "something@example.com";
    const response = await api
      .post("/api/auth/forget-password")
      .send({ email });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "password reset link sent successfully , check your email",
    );
  });
});
