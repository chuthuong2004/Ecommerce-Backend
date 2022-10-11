import { Request, Response, NextFunction } from "express";
import HttpException from "../utils/httpException";

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  res.status(status).send({
    message,
  });
}

export default errorMiddleware;