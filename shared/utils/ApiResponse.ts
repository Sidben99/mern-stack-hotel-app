export type ApiResponseMessage = {
  message: string;
};
export type ApiResponseData<T> = ApiResponseMessage & {
  data: T;
};
export type ApiResponse<T = null> = T extends null
  ? ApiResponseMessage
  : ApiResponseData<T>;
