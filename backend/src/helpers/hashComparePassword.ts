import bcrypt from "bcrypt";
export async function hashPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
}
export async function comparePassword(
  password: string,
  hashedPassword: string,
) {
  const isCorrect = await bcrypt.compare(password, hashedPassword);
  return isCorrect;
}
