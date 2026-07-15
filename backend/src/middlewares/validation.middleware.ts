import validateSchema from "@lankaStay/shared/schemes/validateSchema.ts";
import { Schemas } from "../types/types.ts";
import { Request, Response, NextFunction } from "express";
export default function validationMiddleware(schemas: Schemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(
      "req.body : ",
      req.body,
      " req.query : ",
      req.query,
      " inside validation middleware",
    );
    if (schemas.body) {
      req.body = validateSchema(schemas.body, req.body);
    }
    if (schemas.query) {
      validateSchema(schemas.query, req.query) as any;
    }
    next();
  };
}
