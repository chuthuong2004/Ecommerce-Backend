import { NextFunction, Request, Response } from "express";
import { get } from "lodash";

const requiredUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = get(req, "user");

  if (!user) {
    return res.status(403).json({ message: "Vui lòng đăng nhập !" });
  }
  return next();
};
export default requiredUser;
