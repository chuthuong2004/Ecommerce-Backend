import { NextFunction, Request, Response } from "express";
import { get } from "lodash";

const requiredUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = get(req, "user");

  if (!user) {
    return res.sendStatus(403);
  }
  return next();
};
export default requiredUser;
