import { NextFunction, Request, Response } from "express";
import HttpException from "../utils/httpException";

export function uploadSingleHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res.json({
      message: "Đã upload hình ảnh thành công",
      file: req.file,
      files: req.files,
    });
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export function uploadMultiHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.file, req.files);

    if (req.files)
      return res.json({
        message: "Đã upload nhiều hình ảnh thành công !",
        data: req.files,
      });
    next(new HttpException(400, "Upload hình ảnh thất bại !"));
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
export function uploadCatalogHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.files && req.files.length > 0)
      return res.json({
        message: "Đã upload nhiều hình ảnh thành công !",
        data: req.files,
      });
    next(new HttpException(400, "Upload hình ảnh thất bại !"));
  } catch (error: any) {
    next(new HttpException(500, error.message));
  }
}
