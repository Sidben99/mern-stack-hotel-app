import { z } from "zod";

export const envSchema = z.object({
  MONGODB_URI: z.string("MONGODB_URI is missing"),
  REFRESH_TOKEN_SECRET: z.string("REFRESH_TOKEN_SECRET is missing"),
  ACCESS_TOKEN_SECRET: z.string("ACCESS_TOKEN_SECRET is missing"),
  REFRESH_TOKEN_LIFETIME: z.coerce.number(),
  ACCESS_TOKEN_LIFETIME: z.coerce.number(),
  SMTP_HOST: z.string("SMTP_HOST is missing"),
  SMTP_PORT: z.string("SMTP_PORT is missing"),
  MAILTRAP_USERNAME: z.string("MAILTRAP_USERNAME is missing"),
  MAILTRAP_PASSWORD: z.string("MAILTRAP_PASSWORD is missing"),
});

export type EnvSchema = z.infer<typeof envSchema>;
