import { Request, Response } from "express";

export function uploadSingleHandler(req: Request, res: Response) {
  try {
    console.log(req.file);

    return res.status(200).json({
      message: "Đã upload hình ảnh thành công",
      fileName: req.file?.filename,
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}
export function uploadProductHandler(req: Request, res: Response) {
  try {
    if (req.files) {
      return res.status(200).json({
        message: "Đã upload nhiều hình ảnh thành công !",
        files: req.files,
      });
    }
    return res.status(200).json({
      message: "Upload hình ảnh thất bại !",
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}
export function uploadCatalogHandler(req: Request, res: Response) {
  try {
    if (req.files)
      return res.status(200).json({
        message: "Đã upload nhiều hình ảnh thành công !",
        data: req.files,
      });
    return res.status(200).json({
      message: "Upload hình ảnh thất bại !",
    });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}
