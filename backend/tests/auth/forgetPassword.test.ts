import supertest from "supertest";
import { vi, describe, it, expect } from "vitest";
import app from "../../src/app.ts";
import { registerTestUser } from "./helper.ts";
vi.mock("../../src/helpers/sendEmail.ts");
const api = supertest(app);
describe("POST /api/auth/forget-password", () => {
  it("should return 404 when user is not found", async () => {
    const email = `notFound-${Date.now()}@example.com`;
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
    expect(response.body.details.email).toBe("invalid email address");
  });
  it("should return 200 when password reset email is sent", async () => {
    const { registerResponseBody } = await registerTestUser(api);
    const email = registerResponseBody.data.user.email;
    const response = await api
      .post("/api/auth/forget-password")
      .send({ email });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "password reset link sent successfully , check your email",
    );
  });
});
