import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RenderScreen from '@/test/renderScreen';
describe('forgetPassword page', () => {
  it('should show an error for invalid email', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RenderScreen initPath="/auth/forget-password"></RenderScreen>);
    const submitButton = await screen.findByText('submit');
    const emailInput = await screen.findByRole('textbox', { name: 'email' });
    // ACT
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);
    const errorLabel = await screen.findByText(/invalid email address/);
    // ASSERT
    expect(errorLabel).toBeInTheDocument();
  });
  it('should show an error for not found user', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RenderScreen initPath="/auth/forget-password"></RenderScreen>);
    const submitButton = await screen.findByText('submit');
    const emailInput = await screen.findByRole('textbox', { name: 'email' });
    // ACT
    await user.type(emailInput, 'exist@mail.com');
    await user.click(submitButton);
    const errorToast = await screen.findByText(/user not found/);
    screen.debug();
    // ASSERT
    expect(errorToast).toBeInTheDocument();
  });
  it('should show a success message', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<RenderScreen initPath="/auth/forget-password"></RenderScreen>);
    const submitButton = await screen.findByText('submit');
    const emailInput = await screen.findByRole('textbox', { name: 'email' });
    // ACT
    await user.type(emailInput, 'not-exist@mail.com');
    await user.click(submitButton);
    const successToast = await screen.findByText(/password reset link sent/);
    // ASSERT
    expect(successToast).toBeInTheDocument();
  });
});
