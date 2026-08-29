import type { AccessTokenPayload } from "@/types/types";
declare global {
  namespace Express {
    interface Request {
      user: AccessTokenPayload;
    }
    interface Response {
      locals: {
        validatedQuery: Record<string, unknown>;
      };
    }
  }
}
