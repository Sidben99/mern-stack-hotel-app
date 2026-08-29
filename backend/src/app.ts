import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import errorHandlerMiddleware from "@/middlewares/errorHandler.middleware";
// routes
import rootRouter from "@/routes/root.route";
import { authRouter } from "@/routes/auth.route";
import { userRouter } from "@/routes/user.route";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req: Request, res: Response) => {
  console.log(`${req.method} ${req.url} ${req.ip}`);
  return res.status(200).json({ message: "hello from root" });
});
app.use("/api/", rootRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use((req, res) => {
  return res.status(404).json({ message: "route not found" });
});
app.use(errorHandlerMiddleware);
export default app;
