import { ZodObject } from "zod";
import ApiError from "../utils/ApiError";
import { ZodError } from "zod";
import { ERROR_CODES } from "../consts/errorCodes";
export default function validateSchema(schema: ZodObject, data: unknown) {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const details = Object.fromEntries(
        error.issues.map((issue) => [issue.path, issue.message]),
      );
      console.log("details : ", details);
      console.log("data : ", data);
      throw new ApiError(
        400,
        "validation error",
        ERROR_CODES.VALIDATION_ERROR,
        details,
      );
    }

    throw error;
  }
}
export { ZodObject };
