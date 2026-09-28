import supertest from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../src/app.ts";
import { registerTestUser } from "../helper.ts";
import { UserModel } from "../../src/models/User.model.ts";
const api = supertest(app);
const path = "/api/user/me";
describe("GET /api/user/me", () => {
  it("should return 401 for unauthenticated user", async () => {
    const response = await api.get(path);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("unauthorized user");
  });

  it("should return the authenticated user's info", async () => {
    const { registerResponseBody } = await registerTestUser(api);
    const accessToken = registerResponseBody.data.accessToken;
    const response = await api
      .get(path)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.data.user).toEqual(
      expect.objectContaining({
        id: registerResponseBody.data.user.id,
        username: registerResponseBody.data.user.username,
        email: registerResponseBody.data.user.email,
        role: registerResponseBody.data.user.role,
      }),
    );
  });

  it("should not leak credentials in the response", async () => {
    const { registerResponseBody } = await registerTestUser(api);
    const accessToken = registerResponseBody.data.accessToken;
    const response = await api
      .get(path)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.data.user).not.toHaveProperty("password");
    expect(response.body.data.user).not.toHaveProperty("tokens");
    expect(response.body.data.user).not.toHaveProperty("resetPasswordToken");
  });

  it("should return 404 when the user does not exist", async () => {
    const { registerResponseBody } = await registerTestUser(api);
    const accessToken = registerResponseBody.data.accessToken;
    const { id: userId } = registerResponseBody.data.user;
    await UserModel.deleteOne({ _id: userId });

    const response = await api
      .get(path)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("user not found");
  });
});