"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileFilter = exports.fileStorage = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const moment_1 = __importDefault(require("moment"));
const logger_1 = __importDefault(require("../logger"));
const upload_controller_1 = require("../controllers/upload.controller");
const uuid_1 = require("uuid");
const router = express_1.default.Router();
const date = (0, moment_1.default)(Date.now()).format("yyyyMMDDhhmmss");
exports.fileStorage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        logger_1.default.info(file.filename);
        if (file.fieldname === "avatar") {
            callback(null, path_1.default.join(path_1.default.dirname(__dirname), "public/avatars"));
        }
        else if (file.fieldname === "imageMen" ||
            file.fieldname === "imageWoman" ||
            file.fieldname === "imageKid") {
            callback(null, path_1.default.join(path_1.default.dirname(__dirname), "public/catalogs"));
        }
        else if (file.fieldname === "logo") {
            callback(null, path_1.default.join(path_1.default.dirname(__dirname), "public/brands"));
        }
        else {
            callback(null, path_1.default.join(path_1.default.dirname(__dirname), "public/products"));
        }
    },
    filename: (req, file, callback) => {
        callback(null, (0, uuid_1.v4)() + "-" + file.originalname);
    },
});
const fileFilter = (request, file, callback) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        callback(null, true);
    }
    else {
        callback(null, false);
    }
};
exports.fileFilter = fileFilter;
const upload = (0, multer_1.default)({
    storage: exports.fileStorage,
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
    fileFilter: exports.fileFilter,
});
router.post("/upload/avatar", upload.single("avatar"), upload_controller_1.uploadSingleHandler);
router.post("/upload/brands", upload.single("logo"), upload_controller_1.uploadSingleHandler);
router.post("/upload/products", upload.fields([
    { name: "images", maxCount: 50 },
    { name: "imageSmall", maxCount: 1 },
    { name: "imageMedium", maxCount: 1 },
]), upload_controller_1.uploadProductHandler);
router.post("/upload/catalogs", upload.fields([
    { name: "imageMen", maxCount: 1 },
    { name: "imageWoman", maxCount: 1 },
    { name: "imageKid", maxCount: 1 },
]), upload_controller_1.uploadCatalogHandler);
exports.default = router;
