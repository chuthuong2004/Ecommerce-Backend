"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCatalogHandler = exports.updateCatalogHandler = exports.getCatalogHandler = exports.getAllCatalogHandler = exports.createCatalogHandler = void 0;
const lodash_1 = require("lodash");
const catalog_service_1 = require("../services/catalog.service");
const httpException_1 = __importDefault(require("../utils/httpException"));
function createCatalogHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const catalog = yield (0, catalog_service_1.createCatalog)(req.body);
            res.json({ message: "Tạo catalog thành công !", data: catalog });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.createCatalogHandler = createCatalogHandler;
function getAllCatalogHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const catalogs = yield (0, catalog_service_1.getAllCatalog)(req.query);
            res.json({
                success: true,
                countDocument: catalogs.length,
                resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
                data: catalogs,
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getAllCatalogHandler = getAllCatalogHandler;
function getCatalogHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const catalog = yield (0, catalog_service_1.getCatalog)((0, lodash_1.get)(req.params, "catalogId"));
            if (!catalog)
                return next(new httpException_1.default(404, "Không tìm thấy catalog !"));
            res.json(catalog);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getCatalogHandler = getCatalogHandler;
function updateCatalogHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const catalog = yield (0, catalog_service_1.updateCatalog)({ _id: (0, lodash_1.get)(req.params, "catalogId") }, req.body, { new: true });
            if (!catalog)
                return next(new httpException_1.default(404, "Không tìm thấy catalog !"));
            res.json(catalog);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.updateCatalogHandler = updateCatalogHandler;
function deleteCatalogHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, catalog_service_1.deleteCatalog)((0, lodash_1.get)(req.params, "catalogId"));
            res.json({
                message: "Đã xóa mục lục thành công !",
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.deleteCatalogHandler = deleteCatalogHandler;
