import ApiError from '../../../shared/utils/ApiError';
import { ERROR_CODES } from '../../../shared/consts/errorCodes';
import type {
  ApiResponseData,
  ApiResponseMessage,
} from '../../../shared/utils/ApiResponse';
import { refreshAccessToken } from './auth';
import { router } from '../App.tsx';
import { useUserStore } from '@/store/userStore.ts';
export default async function fetchWrapper<T = null>(
  url: string,
  options: RequestInit,
): Promise<T extends null ? ApiResponseMessage : ApiResponseData<T>> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const res = await fetch(url, options);
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
          return fetchWrapper<T>(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${accessToken}`,
            },
          });
        } catch (refetchError) {
          if (refetchError instanceof ApiError) {
            console.log('refetchError : ', refetchError);
            if (
              refetchError.code === ERROR_CODES.REFRESH_TOKEN_EXPIRED ||
              refetchError.code === ERROR_CODES.INVALID_REFRESH_TOKEN ||
              refetchError.code === ERROR_CODES.UNAUTHORIZED
            ) {
              router.navigate('/auth/login');
              useUserStore.setState({ authState: null });
            }
          }

          throw refetchError;
        }
      }
      throw fetchError;
    } else {
      throw new ApiError(0, 'something went wrong', ERROR_CODES.FETCH_FAILED);
    }
  }
}
