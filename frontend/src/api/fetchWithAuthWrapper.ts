import ApiError from '@lankaStay/shared/utils/ApiError';
import { ERROR_CODES } from '@lankaStay/shared/consts/errorCodes';
import type {
  ApiResponseData,
  ApiResponseMessage,
} from '@lankaStay/shared/utils/ApiResponse';
import { refreshAccessToken } from './auth';
import useAccessTokenStore from '@/store/accessTokenStore';
export default async function fetchWithAuthWrapper<T = null>(
  url: string,
  options: RequestInit,
): Promise<T extends null ? ApiResponseMessage : ApiResponseData<T>> {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    const accessToken = useAccessTokenStore.getState().accessToken;
    const headers = new Headers(options.headers);
    if (!headers.has('authorization')) {
      if (!accessToken) {
        throw new ApiError(
          401,
          'You need to log in to do that',
          ERROR_CODES.UNAUTHORIZED,
        );
      }
      headers.set('authorization', `Bearer ${accessToken}`);
    }
    const fetchOptions = { ...options, headers, credientials: 'include' };
    let res;
    try {
      res = await fetch(url, fetchOptions);
    } catch (error) {
      throw new ApiError(
        0,
        'unable to reach server',
        ERROR_CODES.NETWORK_ERROR,
      );
    }
    const data = await res.json();
    if (!res.ok) {
      throw new ApiError(res.status, data.message, data.code, data.details);
    }
    return data;
  } catch (fetchError) {
    console.log('fetchError : ', fetchError);
    if (fetchError instanceof ApiError) {
      if (fetchError.code === ERROR_CODES.ACCESS_TOKEN_EXPIRED) {
        const refreshTokenResponse = await refreshAccessToken();
        const { accessToken } = refreshTokenResponse.data;
        useAccessTokenStore.setState({ accessToken });
        const headers = new Headers(options.headers);
        headers.set('authorization', `Bearer ${accessToken}`);
        const fetchOptions = { ...options, headers };
        return fetchWithAuthWrapper<T>(url, fetchOptions);
      }
      throw fetchError;
    } else {
      throw new ApiError(0, 'something went wrong', ERROR_CODES.UNKNOWN_ERROR);
    }
  }
}
