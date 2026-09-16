import type { AccessTokenPayload } from "@/types/types";
import type { UserDoc } from "@/models/User.model";
declare global {
  namespace Express {
    interface Request {
      user: AccessTokenPayload;
    }
    interface Response {
      locals: {
        validatedQuery: Record<string, unknown>;
        userDoc?: UserDoc;
      };
    }
  }
}
