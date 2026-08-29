import { test, expect, Page } from "@playwright/test";
import { registerAction } from "../helpers";
const newUser = {
  username: "JohnDoe",
  email: `doe-${Date.now()}@example.com`,
  password: "password",
  confirmPassword: "password",
  nationality: "US",
  phoneNumber: "+19725550123",
} as const;
async function logoutAction(page: Page) {
  await page.getByRole("button", { name: /avatar johndoe/i }).click();
  await page.getByText("log out").click();
}
test.describe("testing the logout feature", () => {
  test("show login button when user logged out successfully ", async ({
    page,
  }) => {
    await registerAction(page, newUser);
    await expect(page).toHaveURL("/");
    await logoutAction(page);
    await expect(page.getByText(/login/)).toBeVisible();
    await expect(page).toHaveURL("/");
  });
});
