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
    const usernameErrorLabel = await screen.findByText(
      /username must be at least 2 characters/,
    );
    const passowrdErrorLabel = await screen.findByText(
      /password must be at least 6 characters/,
    );

    const nationalityErrorLabel =
      await screen.findByText(/invalid country code/);
    const phoneNumberErrorLabel = await screen.findByText(
      /phone number is required/,
    );
    // ASSERT
    expect(emailErrorLabel).toBeInTheDocument();
    expect(passowrdErrorLabel).toBeInTheDocument();
    expect(usernameErrorLabel).toBeInTheDocument();
    expect(nationalityErrorLabel).toBeInTheDocument();
    expect(phoneNumberErrorLabel).toBeInTheDocument();
  });
  it('should show password mismatch error when only passwords differ', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RenderScreen initPath="/auth/register"></RenderScreen>);
    const submitButton = await screen.findByText('submit');
    const usernameInput = await screen.findByLabelText(/username/i);
    const emailInput = await screen.findByLabelText(/email/i);
    const passwordInput = await screen.findByLabelText('Password');
    const confirmPasswordInput =
      await screen.findByLabelText(/confirm password/i);
    const nationalityTrigger = await screen.findByLabelText('Nationality');
    // ACT
    await user.type(usernameInput, 'first');
    await user.type(emailInput, 'mismatch@mail.com');
    await user.type(passwordInput, 'password');
    await user.type(confirmPasswordInput, 'different');
    await user.click(nationalityTrigger);
    await user.click(await screen.findByRole('option', { name: /sri lanka/i }));
    const phoneInput = await screen.findByLabelText('Phone Number');
    await user.type(phoneInput, '+94771234567');
    await user.click(submitButton);
    const mismatchErrorLabel = await screen.findByText(/passwords don't match/);
    // ASSERT
    expect(mismatchErrorLabel).toBeInTheDocument();
  });
  it('should show an error for existing user email ', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RenderScreen initPath="/auth/register"></RenderScreen>);
    const submitButton = await screen.findByText('submit');
    const usernameInput = await screen.findByLabelText(/username/i);
    const emailInput = await screen.findByLabelText(/email/i);
    const passwordInput = await screen.findByLabelText('Password');
    const confirmPasswordInput =
      await screen.findByLabelText(/confirm password/i);
    const nationalityTrigger = await screen.findByLabelText('Nationality');
    // ACT
    await user.type(usernameInput, 'first');
    await user.type(emailInput, 'existing@mail.com');
    await user.type(passwordInput, 'passowrd');
    await user.type(confirmPasswordInput, 'passowrd');
    await user.click(nationalityTrigger);
    await user.click(await screen.findByRole('option', { name: /sri lanka/i }));
    const phoneInput = await screen.findByLabelText('Phone Number');
    await user.type(phoneInput, '+94771234567');
    await user.click(submitButton);
    const errorToast = await screen.findByText(/email already exists/);
    // ASSERT
    expect(errorToast).toBeInTheDocument();
  });
  it('should update the user store and redirect to the home page on success', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RenderScreen initPath="/auth/register"></RenderScreen>);
    const submitButton = await screen.findByText('submit');
    const usernameInput = await screen.findByLabelText(/username/i);
    const emailInput = await screen.findByLabelText(/email/i);
    const passwordInput = await screen.findByLabelText('Password'); // ACT
    const confirmPasswordInput =
      await screen.findByLabelText(/confirm password/i);
    const nationalityTrigger = await screen.findByLabelText('Nationality');

    await user.type(usernameInput, 'first');
    await user.type(emailInput, 'nonexisting@mail.com');
    await user.type(passwordInput, 'passowrd');
    await user.type(confirmPasswordInput, 'passowrd');
    await user.click(nationalityTrigger);
    await user.click(await screen.findByRole('option', { name: /sri lanka/i }));
    const phoneInput = await screen.findByLabelText('Phone Number');
    await user.type(phoneInput, '+94771234567');
    await user.click(submitButton);
    const authState = useUserStore.getState().authState;
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
    const loginHeader = await screen.findByText(/Login Account/i);
    // ASSERT
    expect(loginHeader).toBeInTheDocument();
  });
});
