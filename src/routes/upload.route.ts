import express, { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import moment from "moment";
import log from "../logger";
import {
  uploadCatalogHandler,
  uploadProductHandler,
  uploadSingleHandler,
} from "../controllers/upload.controller";
import { v4 as uuidv4 } from "uuid";
const router = express.Router();
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;
const date = moment(Date.now()).format("yyyyMMDDhhmmss");

export const fileStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    callback: DestinationCallback
  ): void => {
    log.info(file.filename);
    if (file.fieldname === "avatar") {
      callback(null, path.join(path.dirname(__dirname), "public/avatars"));
    } else if (
      file.fieldname === "imageMen" ||
      file.fieldname === "imageWoman" ||
      file.fieldname === "imageKid"
    ) {
      callback(null, path.join(path.dirname(__dirname), "public/catalogs"));
    } else if (file.fieldname === "logo") {
      callback(null, path.join(path.dirname(__dirname), "public/brands"));
    } else {
      callback(null, path.join(path.dirname(__dirname), "public/products"));
    }
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: FileNameCallback
  ): void => {
    callback(null, uuidv4() + "-" + file.originalname);
  },
});
export const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
const upload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter,
});
router.post("/upload/avatar", upload.single("avatar"), uploadSingleHandler);
router.post("/upload/brands", upload.single("logo"), uploadSingleHandler);
router.post(
  "/upload/products",
  upload.fields([
    { name: "images", maxCount: 50 },
    { name: "imageSmall", maxCount: 1 },
    { name: "imageMedium", maxCount: 1 },
  ]),
  uploadProductHandler
);
router.post(
  "/upload/catalogs",
  upload.fields([
    { name: "imageMen", maxCount: 1 },
    { name: "imageWoman", maxCount: 1 },
    { name: "imageKid", maxCount: 1 },
  ]),
  uploadCatalogHandler
);

export default router;
