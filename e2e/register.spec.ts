import { test, expect, Page } from "@playwright/test";
import { registerTestUser } from "./helpers";
import { registerAction } from "./helpers";
const newUser = {
  firstName: "John",
  lastName: "Doe",
  email: `doe-${Date.now()}@example.com`,
  password: "password",
  confirmPassword: "password",
};
const duplicateUser = {
  email: `duplicate-${Date.now()}@mail.com`,
};
test.beforeAll(async () => {
  console.log("before all tests");
  try {
    const { data } = await registerTestUser(duplicateUser);
  } catch (error) {
    console.log("error registering user for 2e2 testing", error);
  }
});

test.describe("testing the register page", () => {
  test("redirect to home page for successfull registration", async ({
    page,
  }) => {
    await registerAction(page, newUser);
    await expect(page.getByText(/welcome/)).toBeVisible();
    await expect(page).toHaveURL("/");
  });
  test("show toast error (email already exists) when user exists", async ({
    page,
  }) => {
    await registerAction(page, { ...newUser, ...duplicateUser });
    await expect(page.getByText(/email already exists/)).toBeVisible();
  });

  test("show frontend validation errors for invalid credentials", async ({
    page,
  }) => {
    await registerAction(page, {
      firstName: "",
      lastName: "",
      email: "notfound.com",
      password: "password",
      confirmPassword: "otherPassowrd",
    });

    await expect(
      page.getByText(/first name must be at least 2 characters /),
    ).toBeVisible();

    await expect(
      page.getByText(/last name must be at least 2 characters /),
    ).toBeVisible();
    await expect(page.getByText(/invalid email address/)).toBeVisible();
    await expect(page.getByText(/passwords don't match/)).toBeVisible();
  });
});
