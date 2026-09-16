import supertest from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../src/app.ts";
import { registerTestUser } from "../helper.ts";
const api = supertest(app);
const path = "/api/user/profile";
describe("PATCH /api/user/profile", () => {
  it("should return 401 for unauthenticated user", async () => {
    const response = await api.patch(path).send({});
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("unauthorized user");
  });

  it("should update a user profile", async () => {
    const { registerResponseBody } = await registerTestUser(api);
    // const agent = supertest.agent(app);
    const accessToken = registerResponseBody.data.accessToken;
    const response = await api
      .patch(path)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        username: "NewName",
        email: registerResponseBody.data.user.email,
        phoneNumber: registerResponseBody.data.user.phoneNumber,
        nationality: registerResponseBody.data.user.nationality,
      });
    expect(response.status).toBe(200);
    expect(response.body.data.user.username).toBe("NewName");
  });
});
