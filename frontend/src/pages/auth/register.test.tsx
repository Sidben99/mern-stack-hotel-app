import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RenderScreen from '@/test/renderScreen';
import { useUserStore } from '@/store/userStore';
describe('register page', () => {
  it('should show form validation errors', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RenderScreen initPath="/auth/register"></RenderScreen>);
    // const form = await screen.findByTestId('register-form');
    // screen.debug(form);
    const submitButton = await screen.findByText('submit');
    const emailInput = await screen.findByLabelText(/email/i);
    const passwordInput = await screen.findByLabelText('Password');
    const confirmPassowrdInput =
      await screen.findByLabelText(/confirm password/i);
    // ACT
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'ccc');
    await user.type(confirmPassowrdInput, 'cc');
    await user.click(submitButton);
    const emailErrorLabel = await screen.findByText(/invalid email address/);
    const firstNameErrorLabel = await screen.findByText(
      /first name must be at least 2 characters/,
    );
    const lastNameErrorLabel = await screen.findByText(
      /last name must be at least 2 characters/,
    );
    const passowrdErrorLabel = await screen.findByText(
      /password must be at least 6 characters/,
    );
    const confirmPassowrdErrorLabel = await screen.findByText(
      /passwords don't match/,
    );
    // ASSERT
    expect(emailErrorLabel).toBeInTheDocument();
    expect(passowrdErrorLabel).toBeInTheDocument();
    expect(firstNameErrorLabel).toBeInTheDocument();
    expect(lastNameErrorLabel).toBeInTheDocument();
    expect(confirmPassowrdErrorLabel).toBeInTheDocument();
  });
  it('should show an error for existing user email ', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RenderScreen initPath="/auth/register"></RenderScreen>);
    const submitButton = await screen.findByText('submit');
    const firstNameInput = await screen.findByLabelText(/first name/i);
    const lastNameInput = await screen.findByLabelText(/last name/i);
    const emailInput = await screen.findByLabelText(/email/i);
    const passwordInput = await screen.findByLabelText('Password');
    const confirmPasswordInput =
      await screen.findByLabelText(/confirm password/i);
    // ACT
    await user.type(firstNameInput, 'first');
    await user.type(lastNameInput, 'last');
    await user.type(emailInput, 'existing@mail.com');
    await user.type(passwordInput, 'passowrd');
    await user.type(confirmPasswordInput, 'passowrd');
    await user.click(submitButton);
    const errorToast = await screen.findByText(/email already exists/);
    screen.debug();
    // ASSERT
    expect(errorToast).toBeInTheDocument();
  });
  it('should update the user store and redirect to the home page on success', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RenderScreen initPath="/auth/register"></RenderScreen>);
    const submitButton = await screen.findByText('submit');
    const firstNameInput = await screen.findByLabelText(/first name/i);
    const lastNameInput = await screen.findByLabelText(/last name/i);
    const emailInput = await screen.findByLabelText(/email/i);
    const passwordInput = await screen.findByLabelText('Password'); // ACT
    const confirmPasswordInput =
      await screen.findByLabelText(/confirm password/i);

    await user.type(firstNameInput, 'first');
    await user.type(lastNameInput, 'last');
    await user.type(emailInput, 'nonexisting@mail.com');
    await user.type(passwordInput, 'passowrd');
    await user.type(confirmPasswordInput, 'passowrd');
    await user.click(submitButton);
    const authState = useUserStore.getState().authState;
    console.log('authState inside register test: ', authState);
    const welcomeMessage = await screen.findByText(/welcome some user/);
    // ASSERT
    expect(authState).toBeDefined();
    expect(welcomeMessage).toBeInTheDocument();
  });
  it('should navigate to the login page', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RenderScreen initPath="/auth/register"></RenderScreen>);
    const loginLink = await screen.findByTestId('login-link');
    // ACT
    await user.click(loginLink);
    const loginHeader = await screen.findByText(/login/);
    // ASSERT
    expect(loginHeader).toBeInTheDocument();
  });
});
