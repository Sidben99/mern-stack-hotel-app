import { Page } from "@playwright/test";
import { RegisterType } from "@lankaStay/shared/schemes/user/registerSchema";
import { ApiResponse } from "@lankaStay/shared/utils/ApiResponse";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema";
export async function registerTestUser(user: Partial<RegisterType> = {}) {
  try {
    const newUser: RegisterType = {
      username: user.username || "JohnDoe",
      email: user.email || `deo-${Date.now()}@example.com`,
      password: user.password || "password",
      confirmPassword: user.confirmPassword || "password",
      nationality: user.nationality || "US",
      phoneNumber: user.phoneNumber || "+19725550123",
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
  await page.getByLabel("Username").fill(credentials.username);
  await page.getByLabel("Email").fill(credentials.email);
  await page.getByLabel("Password", { exact: true }).fill(credentials.password);
  await page.getByLabel("Confirm Password").fill(credentials.confirmPassword);
  if (credentials.nationality) {
    await page.locator('button[role="combobox"]').click();
    const nationalityNames: Record<string, RegExp> = {
      US: /united states of america/i,
      LK: /sri lanka/i,
    };
    await page
      .getByRole("option", { name: nationalityNames[credentials.nationality] })
      .click();
  }
  if (credentials.phoneNumber) {
    await page.getByLabel("Phone Number", { exact: true }).fill(credentials.phoneNumber);
  }
  await page.getByText("submit").click();
}
