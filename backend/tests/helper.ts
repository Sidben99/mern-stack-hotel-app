import { RegisterType } from "@lankaStay/shared/schemes/auth/registerSchema";
import { ApiResponse } from "@lankaStay/shared/utils/ApiResponse";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema";
import { Response } from "supertest";
import { UserModel } from "../src/models/User.model.ts";
import { ROLES } from "@lankaStay/shared/consts/roles";
import { hashPassword } from "../src/helpers/hashComparePassword";
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
export async function registerAndSubmit(
  api,
  endpoint: string,
  fields: Record<string, string>,
  attach: { name: string; buffer: Buffer; filename: string }[] = [],
) {
  const { registerResponseBody } = await registerTestUser(api);
  const accessToken = registerResponseBody.data.accessToken;
  let req = api
    .post(endpoint)
    .set("Authorization", `Bearer ${accessToken}`)
    .field(fields);
  for (const file of attach) {
    req = req.attach(file.name, file.buffer, file.filename);
  }
  return req;
}

export async function createOwner() {
  try {
    const hashedPassword = await hashPassword("password");
    const owner = await UserModel.create({
      username: "JohnDoe",
      email: `deo-${Date.now()}@example.com`,
      password: hashedPassword,
      nationality: "US",
      phoneNumber: "+19725550123",
      role: ROLES.OWNER,
    });
    console.log("owner created : ", owner);
    return owner;
  } catch (error) {
    console.log("error creating owner : ", error);
    throw error;
  }
}
