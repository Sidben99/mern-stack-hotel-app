import { ERROR_CODES } from "../consts/errorCodes";
export default class ApiError extends Error {
  status: number;
  code: ERROR_CODES;
  details: Record<string, string> | null;
  constructor(
    status: number,
    message: string,
    code: ERROR_CODES,
    details?: Record<string, string>,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details ?? null;
  }
}
