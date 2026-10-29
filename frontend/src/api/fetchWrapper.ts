import ApiError from '@lankaStay/shared/utils/ApiError';
import { ERROR_CODES } from '@lankaStay/shared/consts/errorCodes';
import type {
  ApiResponseData,
  ApiResponseMessage,
} from '@lankaStay/shared/utils/ApiResponse';
export default async function fetchWrapper<T = null>(
  url: string,
  options: RequestInit,
): Promise<T extends null ? ApiResponseMessage : ApiResponseData<T>> {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    let res;
    try {
      res = await fetch(url, options);
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
      throw fetchError;
    } else {
      throw new ApiError(0, 'something went wrong', ERROR_CODES.UNKNOWN_ERROR);
    }
  }
}
