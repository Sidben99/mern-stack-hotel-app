import { envSchema, EnvSchema } from "../../../shared/schemes/envSchema";
let parsedEnv: EnvSchema;
export function initEnv() {
  parsedEnv = envSchema.parse(process.env);
}
export function getEnv() {
  return parsedEnv;
}
