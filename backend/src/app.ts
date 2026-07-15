import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { authRouter } from "./routes/auth.route.ts";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware.ts";
import rootRouter from "./routes/root.route.ts";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "test" });
});
app.use("/api/", rootRouter);
app.use("/api/auth", authRouter);
app.use((req, res) => {
  return res.status(404).json({ message: "route not found" });
});
app.use(errorHandlerMiddleware);
export default app;
