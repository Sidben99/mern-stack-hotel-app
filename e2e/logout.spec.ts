import { test, expect, Page } from "@playwright/test";
import { registerAction } from "./helpers";
const newUser = {
  firstName: "John",
  lastName: "Doe",
  email: `doe-${Date.now()}@example.com`,
  password: "password",
  confirmPassword: "password",
};
async function logoutAction(page: Page) {
  await page.getByText(/john doe/i).click();
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
