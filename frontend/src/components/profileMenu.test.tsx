import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '@/mocks/node';
import { http, HttpResponse } from 'msw';
import RenderScreen from '@/test/renderScreen';
import { useUserStore } from '@/store/userStore';
const seededAuthState = {
  user: {
    id: '1',
    username: 'some user',
    email: 'some@mail.com',
    role: 'user' as const,
    avatar: '',
    phoneNumber: '0771234567',
    nationality: 'LK',
  },
  accessToken: 'token',
};
describe('profile menu', () => {
  it('should log the user out and redirect to the home page on success', async () => {
    // ARRANGE
    const user = userEvent.setup();
    useUserStore.setState({ authState: seededAuthState });
    render(<RenderScreen initPath="/auth/login"></RenderScreen>);
    // ACT
    await user.click(await screen.findByText(/some user/));
    await user.click(await screen.findByText(/log out/i));
    const authState = useUserStore.getState().authState;
    const welcomeMessage = await screen.findByText(/welcome guest/);
    // ASSERT
    expect(authState).toBeNull();
    expect(welcomeMessage).toBeInTheDocument();
  });
  it('should keep the user logged in and show an error toast on failure', async () => {
    // ARRANGE
    const user = userEvent.setup();
    server.use(
      http.post('http://localhost:5000/api/auth/logout', () =>
        HttpResponse.json(
          { message: 'logout failed', code: 500 },
          { status: 500 },
        ),
      ),
    );
    useUserStore.setState({ authState: seededAuthState });
    render(<RenderScreen initPath="/auth/login"></RenderScreen>);
    // ACT
    await user.click(await screen.findByText(/some user/));
    await user.click(await screen.findByText(/log out/i));
    const errorToast = await screen.findByText(/logout failed/);
    const authState = useUserStore.getState().authState;
    // ASSERT
    expect(errorToast).toBeInTheDocument();
    expect(authState).toBeDefined();
  });
});
