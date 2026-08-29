import { test, expect, Page } from "@playwright/test";
import { registerTestUser } from "../helpers";
import { LoginType } from "@lankaStay/shared/schemes/user/loginSchema";
const newUser = {
  email: `doe-${Date.now()}@example.com`,
  password: "password",
};
test.beforeAll(async () => {
  try {
    await registerTestUser(newUser);
  } catch (error) {
    console.log("error registering user for 2e2 testing", error);
  }
});
async function loginAction(page: Page, credentials: LoginType) {
  await page.goto("/auth/login");
  await page.getByLabel("Email").fill(credentials.email);
  await page.getByLabel("Password").fill(credentials.password);
  await page.getByText("submit").click();
}
test.describe("testing the login page", () => {
  test("redirect to home page for successfull login", async ({ page }) => {
    await loginAction(page, newUser);
    await expect(page.getByText(/welcome/)).toBeVisible();
    await expect(page).toHaveURL("/");
  });
  test("show toast error (invalid credentials) when user not found", async ({
    page,
  }) => {
    await loginAction(page, {
      email: "notfound@mail.com",
      password: "password",
    });
    await expect(page.getByText(/invalid credentials/)).toBeVisible();
  });
  test("show toast error (invalid credentials) for incorrect password", async ({
    page,
  }) => {
    await loginAction(page, {
      email: newUser.email,
      password: "wrongPassword",
    });
    await expect(page.getByText(/invalid credentials/)).toBeVisible();
  });
  test("show frontend validation errors for invalid credentials", async ({
    page,
  }) => {
    await loginAction(page, {
      email: "notfound.com",
      password: "",
    });

    await expect(page.getByText(/invalid email address/)).toBeVisible();
    await expect(
      page.getByText(/password must be at least 6 characters long/),
    ).toBeVisible();
  });
});
