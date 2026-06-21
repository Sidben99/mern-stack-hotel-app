import { createTransport } from "nodemailer";
import { getEnv } from "../conf/env.conf";
export async function sendEmail(
  email: string,
  subject: string,
  message: string,
  html: string,
) {
  const envs = getEnv();
  const transport = createTransport({
    host: envs.SMTP_HOST,
    port: parseInt(envs.SMTP_PORT),
    secure: false,
    auth: {
      user: envs.MAILTRAP_USERNAME,
      pass: envs.MAILTRAP_PASSWORD,
    },
  });
  await transport.sendMail({
    from: '"mern-booking-app" <mern-booking-app@localhost>',
    to: email,
    subject,
    text: message,
    html: html,
  });
}
