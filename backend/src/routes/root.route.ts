import { Router } from "express";
import authenticateMiddleware from "../middlewares/authenticate.middleware";
const rootRouter = Router();
/**
 * HEADERS:  Authorization: Bearer <token>
 * SUCCESS:  200  { message }
 * ERRORS:  401  UNAUTHORIZED
 */
rootRouter.route("/").get(authenticateMiddleware, (req, res) => {
  res.status(200).json({ message: "hello from root" });
});
export default rootRouter;
