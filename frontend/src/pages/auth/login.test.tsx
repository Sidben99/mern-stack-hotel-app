import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RenderScreen from '@/test/renderScreen';
import { useUserStore } from '@/store/userStore';
describe('login page', { skip: true }, () => {
  it('should show an error for invalid email and invalid password', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RenderScreen initPath="/auth/login"></RenderScreen>);
    const submitButton = await screen.findByText('submit');
    const emailInput = await screen.findByLabelText(/email/i);
    const passwordInput = await screen.findByLabelText(/password/i);
    // ACT
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'ccc');
    await user.click(submitButton);
    screen.debug();
    const emailErrorLabel = await screen.findByText(/invalid email address/);
    const passowrdErrorLabel = await screen.findByText(
      /password must be at least 6 characters/,
    );
    // ASSERT
    expect(emailErrorLabel).toBeInTheDocument();
    expect(passowrdErrorLabel).toBeInTheDocument();
  });
  it('should show an error invalid credentials for not found user ', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RenderScreen initPath="/auth/login"></RenderScreen>);
    const submitButton = await screen.findByText('submit');
    const emailInput = await screen.findByLabelText(/email/i);
    const passwordInput = await screen.findByLabelText(/password/i);
    // ACT
    await user.type(emailInput, 'noexist@mail.com');
    await user.type(passwordInput, 'passowrd');
    await user.click(submitButton);
    const errorToast = await screen.findByText(/invalid credentials/);
    screen.debug();
    // ASSERT
    expect(errorToast).toBeInTheDocument();
  });
  it('should update the user store and redirect to the home page on success', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RenderScreen initPath="/auth/login"></RenderScreen>);
    const submitButton = await screen.findByText('submit');
    const emailInput = await screen.findByLabelText(/email/i);
    const passwordInput = await screen.findByLabelText(/password/i);
    // ACT
    await user.type(emailInput, 'valid@mail.com');
    await user.type(passwordInput, 'passowrd');
    await user.click(submitButton);
    const authState = useUserStore.getState().authState;
    const welcomeMessage = await screen.findByText(/welcome some user/);
    // ASSERT
    expect(authState).toBeDefined();
    expect(welcomeMessage).toBeInTheDocument();
  });
  it('should navigate to the register page', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RenderScreen initPath="/auth/login"></RenderScreen>);
    const createAccountLink = await screen.findByText(/create an account/i);
    // ACT
    await user.click(createAccountLink);
    const registerHeader = await screen.findByText(/register/);
    // ASSERT
    expect(registerHeader).toBeInTheDocument();
  });
  it('should navigate to the forget password page', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RenderScreen initPath="/auth/login"></RenderScreen>);
    const forgetPasswordLink = await screen.findByText(/forgot your password/i);
    // ACT
    await user.click(forgetPasswordLink);
    const forgetPasswordHeader = await screen.findByText(/forget password/);
    // ASSERT
    expect(forgetPasswordHeader).toBeInTheDocument();
  });
});
