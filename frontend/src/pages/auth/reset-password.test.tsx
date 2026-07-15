import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RenderScreen from '@/test/renderScreen';
describe('reset password page', { skip: true }, () => {
  it('should show validation errors for invalid password and confirm password', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RenderScreen initPath="/auth/reset-password"></RenderScreen>);
    // const form = await screen.findByTestId('register-form');
    // screen.debug(form);
    const submitButton = await screen.findByText('submit');
    const passwordInput = await screen.findByLabelText('password');
    const confirmPassowrdInput =
      await screen.findByLabelText(/confirm password/i);
    // ACT
    await user.type(passwordInput, 'ccc');
    await user.type(confirmPassowrdInput, 'ccccccc');
    await user.click(submitButton);
    const passowrdErrorLabel = await screen.findByText(
      /password must be at least 6 characters/,
    );
    const confirmPassowrdErrorLabel = await screen.findByText(
      /passwords don't match/,
    );
    // ASSERT
    expect(passowrdErrorLabel).toBeInTheDocument();
    expect(confirmPassowrdErrorLabel).toBeInTheDocument();
  });
  it('should show an error for an expired token', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(
      <RenderScreen initPath="/auth/reset-password?token=expired"></RenderScreen>,
    );
    // const form = await screen.findByTestId('register-form');
    // screen.debug(form);
    const submitButton = await screen.findByText('submit');
    const passwordInput = await screen.findByLabelText('password');
    const confirmPassowrdInput =
      await screen.findByLabelText(/confirm password/i);
    // ACT
    await user.type(passwordInput, 'password');
    await user.type(confirmPassowrdInput, 'password');
    await user.click(submitButton);

    const errorToast = await screen.findByText(/token expired/);
    // ASSERT
    expect(errorToast).toBeInTheDocument();
  });
  it('should show a success message', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(
      <RenderScreen initPath="/auth/reset-password?token=valid"></RenderScreen>,
    );
    const submitButton = await screen.findByText('submit');
    const passwordInput = await screen.findByLabelText('password');
    const confirmPassowrdInput =
      await screen.findByLabelText(/confirm password/i);
    // ACT
    await user.type(passwordInput, 'password');
    await user.type(confirmPassowrdInput, 'password');
    await user.click(submitButton);
    const successToast = await screen.findByText(/password reset successfully/);
    // ASSERT
    expect(successToast).toBeInTheDocument();
  });
});
