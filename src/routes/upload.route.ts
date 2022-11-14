import { v4 as uuidv4 } from "uuid";
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
import { requiresAdmin, requiresUser } from "../middlewares";

const router = express.Router();

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;
const date = moment(Date.now()).format("yyyyMMDDhhmmss");

enum FieldName {
  AVATAR = "avatar",
  IMAGE_MEN = "imageMen",
  IMAGE_WOMAN = "imageWoman",
  IMAGE_KID = "imageKid",
  IMAGE_BRAND = "imageBrand",
  IMAGE_LARGE = "images",
  IMAGE_MEDIUM = "imageMedium",
  IMAGE_SMALL = "imageSmall",
}
const destination = {
  [FieldName.AVATAR]: "avatars",
  [FieldName.IMAGE_MEN]: "catalogs",
  [FieldName.IMAGE_WOMAN]: "catalogs",
  [FieldName.IMAGE_KID]: "catalogs",
  [FieldName.IMAGE_BRAND]: "brands",
  [FieldName.IMAGE_LARGE]: "products",
  [FieldName.IMAGE_SMALL]: "products",
  [FieldName.IMAGE_MEDIUM]: "products",
};
export const fileStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    callback: DestinationCallback
  ): void => {
    log.info(file.filename);
    callback(
      null,
      path.join(
        path.dirname(__dirname),
        `public/${destination[file.fieldname]}`
      )
    );
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: FileNameCallback
  ): void => {
    const generator: string = uuidv4().split("-").join("");
    callback(null, date + generator + path.extname(file.originalname));
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
router.post(
  "/upload/avatar",
  requiresUser,
  upload.single(FieldName.AVATAR),
  uploadSingleHandler
);
router.post(
  "/upload/brands",
  upload.single(FieldName.IMAGE_BRAND),
  uploadSingleHandler
);
router.post(
  "/upload/products",
  upload.fields([
    { name: FieldName.IMAGE_LARGE, maxCount: 50 },
    { name: FieldName.IMAGE_SMALL, maxCount: 1 },
    { name: FieldName.IMAGE_MEDIUM, maxCount: 1 },
  ]),
  uploadProductHandler
);
router.post(
  "/upload/catalogs",
  upload.fields([
    { name: FieldName.IMAGE_MEN, maxCount: 1 },
    { name: FieldName.IMAGE_WOMAN, maxCount: 1 },
    { name: FieldName.IMAGE_KID, maxCount: 1 },
  ]),
  uploadCatalogHandler
);

export default router;
