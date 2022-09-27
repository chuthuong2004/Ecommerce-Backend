import { NextFunction, Request, Response } from "express";
import { get } from "lodash";

const requiresAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = get(req, "user");

  if (!user || !user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Vui lòng đăng nhập với quyền Admin!" });
  }
  return next();
};
export default requiresAdmin;
