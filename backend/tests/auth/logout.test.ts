import supertest from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../src/app.ts";
import { LoginType } from "@lankaStay/shared/schemes/user/loginSchema.ts";
import { RegisterType } from "@lankaStay/shared/schemes/user/registerSchema.ts";
import { ApiResponse } from "@lankaStay/shared/utils/ApiResponse.ts";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema.ts";
import { UserModel } from "../../src/models/User.model.ts";
const api = supertest.agent(app);
describe("POST /api/auth/logout", () => {
  it("should remove the token from db and return 200 OK", async () => {
    const registerBody: RegisterType = {
      email: "something@example.com",
      password: "password",
      firstName: "John",
      lastName: "Doe",
      confirmPassword: "password",
    };
    const response = await api.post("/api/auth/register").send(registerBody);
    const responseBody = response.body as ApiResponse<{
      user: UserResponseType;
      accessToken: string;
    }>;
    const userBeforeLogout = await UserModel.findById(
      responseBody.data.user.id,
    );
    expect(userBeforeLogout?.tokens.length).toBe(1);
    const logoutResponse = await api.post("/api/auth/logout");
    const logoutResponseBody = logoutResponse.body as ApiResponse;
    const userAfterLogout = await UserModel.findById(responseBody.data.user.id);
    expect(userAfterLogout?.tokens.length).toBe(0);
    expect(logoutResponse.status).toBe(200);
    expect(logoutResponseBody.message).toBe("logged out successfully");
  });
});
