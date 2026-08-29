import { RegisterType } from "@lankaStay/shared/schemes/user/registerSchema";
import { ApiResponse } from "@lankaStay/shared/utils/ApiResponse";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema";
import { Response } from "supertest";
export async function registerTestUser(api, user: Partial<RegisterType> = {}) {
  try {
    const newUser: RegisterType = {
      username: user.username || "JohnDoe",
      email: user.email || `deo-${Date.now()}@example.com`,
      password: user.password || "password",
      confirmPassword: user.confirmPassword || "password",
      nationality: user.nationality || "US",
      phoneNumber: user.phoneNumber || "+19725550123",
    };
    const registerResponse = (await api
      .post("/api/auth/register")
      .send(newUser)) as Response;
    const registerResponseBody = registerResponse.body as ApiResponse<{
      user: UserResponseType;
      accessToken: string;
    }>;
    return { registerResponse, registerResponseBody };
  } catch (error) {
    console.log("error creating user : ", error);
    throw error;
  }
}
type cookieOptions = {
  domain?: string;
  secure?: boolean;
  path?: string;
  script?: boolean;
};
export function getCookieFromJar(
  api,
  cookieName: string = "refreshToken",
  options: cookieOptions = {},
) {
  const cookie = api.jar.getCookie(cookieName, {
    domain: options.domain || "127.0.0.1",
    secure: options.secure || false,
    path: options.path || "/",
    script: options.script || false,
  });
  return cookie;
}
