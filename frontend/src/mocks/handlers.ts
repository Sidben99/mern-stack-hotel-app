// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import type { ForgetPassword } from '@lankaStay/shared/schemes/user/forgetPasswordSchema';
import { ERROR_CODES } from '@lankaStay/shared/consts/errorCodes';
import type { LoginType } from '@lankaStay/shared/schemes/user/loginSchema';
import type { RegisterType } from '@lankaStay/shared/schemes/user/registerSchema';
export const handlers = [
  http.post(
    'http://localhost:5000/api/auth/forget-password',
    async ({ request }) => {
      const { email } = (await request.json()) as ForgetPassword;
      if (email == 'exist@mail.com') {
        console.log('email inside handlers : ', email);
        return HttpResponse.json(
          {
            message: 'user not found',
            code: ERROR_CODES.NOT_FOUND,
          },
          {
            status: 404,
          },
        );
      } else {
        return HttpResponse.json({
          message: 'password reset link sent successfully , check your email',
        });
      }
    },
  ),
  http.post('http://localhost:5000/api/auth/login', async ({ request }) => {
    const { email } = (await request.json()) as LoginType;
    if (email == 'noexist@mail.com') {
      return HttpResponse.json(
        {
          message: 'invalid credentials',
          code: ERROR_CODES.NOT_FOUND,
        },
        {
          status: 404,
        },
      );
    } else {
      return HttpResponse.json({
        message: 'User logged in successfully',
        data: {
          accessToken: 'token',
          user: { firstName: 'some user' },
        },
      });
    }
  }),
  http.post('http://localhost:5000/api/auth/register', async ({ request }) => {
    const { email } = (await request.json()) as RegisterType;
    console.log('email inside register : ', email);
    if (email == 'existing@mail.com') {
      return HttpResponse.json(
        {
          message: 'email already exists',
          code: ERROR_CODES.UNAUTHORIZED,
        },
        {
          status: 409,
        },
      );
    } else {
      return HttpResponse.json({
        message: 'User registered',
        data: {
          accessToken: 'token',
          user: { firstName: 'some user' },
        },
      });
    }
  }),
  http.post(
    'http://localhost:5000/api/auth/reset-password',
    async ({ request }) => {
      const params = new URL(request.url).searchParams;
      const token = params.get('token');
      console.log('token inside the reset-passowrd mock handler : ', token);
      console.log('url inside the reset-passowrd mock handler : ', request.url);
      if (!token || token == 'expired') {
        return HttpResponse.json(
          {
            message: 'token expired',
            code: ERROR_CODES.TOKEN_EXPIRED,
          },
          {
            status: 401,
          },
        );
      } else {
        return HttpResponse.json({
          message: 'password reset successfully',
        });
      }
    },
  ),
];
