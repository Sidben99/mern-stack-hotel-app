import { Page } from "@playwright/test";
import { RegisterType } from "@lankaStay/shared/schemes/user/registerSchema";
import { ApiResponse } from "@lankaStay/shared/utils/ApiResponse";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema";
export async function registerTestUser(user: Partial<RegisterType> = {}) {
  try {
    const newUser: RegisterType = {
      firstName: user.firstName || "John",
      lastName: user.lastName || "Doe",
      email: user.email || `deo-${Date.now()}@example.com`,
      password: user.password || "password",
      confirmPassword: user.confirmPassword || "password",
    };
    console.log("new user : ", newUser);
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      throw new Error(errorMessage.message);
    }
    const registerResponseBody = (await res.json()) as ApiResponse<{
      user: UserResponseType;
      accessToken: string;
    }>;
    return registerResponseBody;
  } catch (error) {
    console.log("error creating user : ", error);
    throw error;
  }
}
export async function registerAction(page: Page, credentials: RegisterType) {
  await page.goto("/auth/register");
  await page.getByLabel("First Name").fill(credentials.firstName);
  await page.getByLabel("Last Name").fill(credentials.lastName);
  await page.getByLabel("Email").fill(credentials.email);
  await page.getByLabel("Password", { exact: true }).fill(credentials.password);
  await page.getByLabel("Confirm Password").fill(credentials.confirmPassword);
  await page.getByText("submit").click();
}
