import supertest from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../src/app.ts";
import { ApiResponse } from "@lankaStay/shared/utils/ApiResponse.ts";
import { UserModel } from "../../src/models/User.model.ts";
import { registerTestUser, getCookieFromJar } from "./helper.ts";
const api = supertest.agent(app);
describe("POST /api/auth/logout", () => {
  it("should remove the token from db and from the jar and return 200 OK", async () => {
    const { registerResponseBody } = await registerTestUser(api);
    console.log("registerResponseBody : ", registerResponseBody);
    const cookieBeforeLogout = getCookieFromJar(api);

    console.log("cookieBeforeLogout : ", cookieBeforeLogout);
    expect(cookieBeforeLogout).toBeDefined();
    const userBeforeLogout = await UserModel.findById(
      registerResponseBody.data.user.id,
    );
    expect(userBeforeLogout?.tokens.length).toBe(1);
    const logoutResponse = await api.post("/api/auth/logout");
    const logoutResponseBody = logoutResponse.body as ApiResponse;
    const userAfterLogout = await UserModel.findById(
      registerResponseBody.data.user.id,
    );
    const cookieAfterLogout = getCookieFromJar(api);
    expect(userAfterLogout?.tokens.length).toBe(0);
    expect(logoutResponse.status).toBe(200);
    expect(logoutResponseBody.message).toBe("logged out successfully");
    expect(cookieAfterLogout).toBeUndefined();
  });
});
