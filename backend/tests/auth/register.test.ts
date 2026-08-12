import supertest from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../src/app.ts";
import { RegisterType } from "@lankaStay/shared/schemes/user/registerSchema.ts";
import { registerTestUser, getCookieFromJar } from "./helper.ts";
const api = supertest(app);
const user: Partial<RegisterType> = {
  email: `somebody-${Date.now()}@example.com`,
};

describe("POST /api/auth/register", () => {
  it("should return 201 when registering a new user", async () => {
    const api = supertest.agent(app);
    const { registerResponse, registerResponseBody } = await registerTestUser(
      api,
      user,
    );
    const cookie = getCookieFromJar(api);
    expect(registerResponse.status).toBe(201);
    expect(registerResponseBody.message).toBe("User registered successfully");
    expect(registerResponseBody.data.user.email).toBe(user.email);
    expect(registerResponseBody.data.user).not.haveOwnProperty("password");
    expect(Object.keys(registerResponseBody.data)).toEqual([
      "accessToken",
      "user",
    ]);
    expect(cookie).toBeDefined();
  });
  it("should return 409 when email already exists", async () => {
    const { registerResponse, registerResponseBody } = await registerTestUser(
      api,
      user,
    );
    expect(registerResponse.status).toBe(409);
    expect(registerResponseBody.message).toBe("email already exists");
  });
});
