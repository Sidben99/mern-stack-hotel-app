import { test, expect, Page } from "@playwright/test";
import { registerTestUser } from "../helpers";
import jwt from "jsonwebtoken";
import { ResetPasswordNewPasswordType } from "@lankaStay/shared/schemes/user/resetPasswordSchema";
let token = "";
let userId = "";
test.beforeAll(async () => {
  try {
    const { data } = await registerTestUser();
    userId = data.user.id;
    token = jwt.sign({ sub: data.user.id }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "1d",
    });
  } catch (error) {
    console.log("error registering user for 2e2 testing", error);
  }
});
async function resetPassowrdAction(
  page: Page,
  resetPassword: ResetPasswordNewPasswordType,
) {
  await page.goto(`/auth/reset-password?token=${token}`);
  await page
    .getByLabel("password", { exact: true })
    .fill(resetPassword.password);
  await page
    .getByLabel("confirm password", { exact: true })
    .fill(resetPassword.confirmPassword);
  await page.getByText("submit").click();
}
test.describe("testing the reset password page", () => {
  test("show success toast for successfull password reset", async ({
    page,
  }) => {
    await resetPassowrdAction(page, {
      password: "password",
      confirmPassword: "password",
    });
    await expect(page.getByText(/password reset successfully/)).toBeVisible();
  });
  test("show toast error (token expired) for expired token", async ({
    page,
  }) => {
    token = jwt.sign({ sub: userId }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: 0,
    });
    await resetPassowrdAction(page, {
      password: "password",
      confirmPassword: "password",
    });
    await expect(page.getByText(/token expired/)).toBeVisible();
  });
  test("show toast error (invalid token) for invalid token", async ({
    page,
  }) => {
    token = "invalidtoken";
    await resetPassowrdAction(page, {
      password: "password",
      confirmPassword: "password",
    });
    await expect(page.getByText(/invalid token/)).toBeVisible();
  });
  test("show validation error for invalid data", async ({ page }) => {
    await resetPassowrdAction(page, {
      password: "pass",
      confirmPassword: "password",
    });

    await expect(page.getByText(/passwords don't match/)).toBeVisible();
  });
});
