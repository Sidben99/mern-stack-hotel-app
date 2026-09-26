import ApiError from '@lankaStay/shared/utils/ApiError';
import { ERROR_CODES } from '@lankaStay/shared/consts/errorCodes';
import type {
  ApiResponseData,
  ApiResponseMessage,
} from '@lankaStay/shared/utils/ApiResponse';
import { refreshAccessToken } from './auth';
import { useUserStore } from '@/store/userStore.ts';
export default async function fetchWithAuthWrapper<T = null>(
  url: string,
  options: RequestInit,
): Promise<T extends null ? ApiResponseMessage : ApiResponseData<T>> {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    const accessToken = useUserStore.getState().authState?.accessToken;
    const headers = new Headers(options.headers);
    if (!headers.has('authorization')) {
      if (!accessToken) {
        window.location.href = '/auth/login';
        throw new ApiError(
          401,
          'You need to log in to do that',
          ERROR_CODES.UNAUTHORIZED,
        );
      }
      headers.set('authorization', `Bearer ${accessToken}`);
    }
    const fetchOptions = { ...options, headers };
    const res = await fetch(url, fetchOptions);
    const data = await res.json();
    if (!res.ok) {
      throw new ApiError(data.status, data.message, data.code, data.details);
    }
    return data;
  } catch (fetchError) {
    console.log('fetchError : ', fetchError);
    if (fetchError instanceof ApiError) {
      if (fetchError.code === ERROR_CODES.ACCESS_TOKEN_EXPIRED) {
        try {
          const refreshTokenResponse = await refreshAccessToken();
          const { accessToken, user } = refreshTokenResponse.data;
          console.log('new accessToken : ', accessToken);
          useUserStore.setState({ authState: { user, accessToken } });
          const headers = new Headers(options.headers);
          headers.set('authorization', `Bearer ${accessToken}`);
          const fetchOptions = { ...options, headers };
          return fetchWithAuthWrapper<T>(url, fetchOptions);
        } catch (refetchError) {
          if (refetchError instanceof ApiError) {
            console.log('refetchError : ', refetchError);
            if (
              refetchError.code === ERROR_CODES.REFRESH_TOKEN_EXPIRED ||
              refetchError.code === ERROR_CODES.INVALID_REFRESH_TOKEN ||
              refetchError.code === ERROR_CODES.UNAUTHORIZED
            ) {
              window.location.href = '/auth/login';
            }
          }

          throw refetchError;
        }
      }
      throw fetchError;
    } else if (fetchError instanceof TypeError) {
      throw new ApiError(
        0,
        'unable to reach server , please try again',
        ERROR_CODES.FETCH_FAILED,
      );
    } else {
      throw new ApiError(0, 'something went wrong', ERROR_CODES.FETCH_FAILED);
    }
  }
}
