import { test, expect, Page } from "@playwright/test";
import { registerTestUser } from "./helpers";
import { ForgetPassword } from "@lankaStay/shared/schemes/user/forgetPasswordSchema";
const newUser = {
  email: `doe-${Date.now()}@example.com`,
};
test.beforeAll(async () => {
  try {
    await registerTestUser(newUser);
  } catch (error) {
    console.log("error registering user for 2e2 testing", error);
  }
});
async function forgetPasswordAction(
  page: Page,
  forgetPassword: ForgetPassword,
) {
  await page.goto("/auth/forget-password");
  await page.getByLabel("Email").fill(forgetPassword.email);
  await page.getByText("submit").click();
}
test.describe("testing the forget password page", () => {
  test("show success toast for successfull email transfer", async ({
    page,
  }) => {
    await forgetPasswordAction(page, newUser);
    await expect(
      page.getByText(
        /password reset link sent successfully , check your email/,
      ),
    ).toBeVisible();
  });
  test("show toast error (user not found) when user not found", async ({
    page,
  }) => {
    await forgetPasswordAction(page, {
      email: "notfound@mail.com",
    });
    await expect(page.getByText(/user not found/)).toBeVisible();
  });
  test("show validation error (invalid email) for invalid email", async ({
    page,
  }) => {
    await forgetPasswordAction(page, {
      email: "invalidemail.com",
    });
    await expect(page.getByText(/invalid email/)).toBeVisible();
  });
});
