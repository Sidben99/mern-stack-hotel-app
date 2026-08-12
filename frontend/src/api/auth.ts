import { type RegisterType } from '@lankaStay/shared/schemes/user/registerSchema.ts';
import type { LoginType } from '@lankaStay/shared/schemes/user/loginSchema.ts';
import type { ForgetPassword } from '@lankaStay/shared/schemes/user/forgetPasswordSchema.ts';
import type {
  ResetPasswordDataType,
  ResetPasswordTokenType,
} from '@lankaStay/shared/schemes/user/resetPasswordSchema.ts';
import type { UserResponseType } from '@lankaStay/shared/schemes/user/userResponseSchema.ts';
import fetchWrapper from './fetchWrapper.ts';
export async function register(credentials: RegisterType) {
  return fetchWrapper<{ accessToken: string; user: UserResponseType }>(
    'http://localhost:5000/api/auth/register',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include',
    },
  );
}
export async function login(credentials: LoginType) {
  return fetchWrapper<{ accessToken: string; user: UserResponseType }>(
    'http://localhost:5000/api/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    },
  );
}
export async function forgetPassword(email: ForgetPassword) {
  return fetchWrapper('http://localhost:5000/api/auth/forget-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(email),
  });
}
export async function resetPassword(
  newPasswordNToken: ResetPasswordDataType & ResetPasswordTokenType,
) {
  const { password, token } = newPasswordNToken;
  return fetchWrapper(
    `http://localhost:5000/api/auth/reset-password?token=${token}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    },
  );
}
export async function logout() {
  return fetchWrapper('http://localhost:5000/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
}
export async function refreshAccessToken() {
  return fetchWrapper<{ accessToken: string; user: UserResponseType }>(
    'http://localhost:5000/api/auth/refresh-token',
    {
      method: 'POST',
      credentials: 'include',
    },
  );
}
