import { ZodObject } from "zod";
import { ROLES } from "../../../shared/consts/roles";
export type RefreshTokenPayload = {
  sub: string;
  role: ROLES;
  tokenId: string;
};
export type TokenType = "access" | "refresh" | "regular";
export type AccessTokenPayload = Omit<RefreshTokenPayload, "tokenId">;
export type Schemas = {
  body?: ZodObject;
  query?: ZodObject;
};
