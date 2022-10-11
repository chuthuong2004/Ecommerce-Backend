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
exports.deleteBrandHandler = exports.updateBrandHandler = exports.getBrandHandler = exports.getAllBrandHandler = exports.createBrandHandler = void 0;
const lodash_1 = require("lodash");
const brand_service_1 = require("../services/brand.service");
const httpException_1 = __importDefault(require("../utils/httpException"));
function createBrandHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const brand = yield (0, brand_service_1.createBrand)(Object.assign({}, body));
            if (!brand) {
                return next(new httpException_1.default(400, "Tạo brand thất bại !"));
            }
            res.json({ message: "Tạo brand thành công !", data: brand });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.createBrandHandler = createBrandHandler;
function getAllBrandHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const brands = yield (0, brand_service_1.getAllBrand)(req.query);
            res.json({
                countDocument: brands.length,
                resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
                data: brands,
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getAllBrandHandler = getAllBrandHandler;
function getBrandHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const brand = yield (0, brand_service_1.getBrand)((0, lodash_1.get)(req.params, "brandId"));
            if (!brand) {
                return next(new httpException_1.default(404, "Không tìm thấy brand !"));
            }
            res.json(brand);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getBrandHandler = getBrandHandler;
function updateBrandHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const brand = yield (0, brand_service_1.updateBrand)({ _id: (0, lodash_1.get)(req.params, "brandId") }, req.body, { new: true });
            if (!brand) {
                next(new httpException_1.default(404, "Không tìm thấy brand !"));
            }
            res.json(brand);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.updateBrandHandler = updateBrandHandler;
function deleteBrandHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, brand_service_1.deleteBrand)((0, lodash_1.get)(req.params, "catalogId"));
            next(new httpException_1.default(200, "Đã xóa thương hiệu thành công !"));
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.deleteBrandHandler = deleteBrandHandler;
