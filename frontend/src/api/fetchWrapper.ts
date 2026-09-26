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
    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) {
      throw new ApiError(data.status, data.message, data.code, data.details);
    }
    return data;
  } catch (fetchError) {
    console.log('fetchError : ', fetchError);
    if (fetchError instanceof ApiError) {
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
