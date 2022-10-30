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
exports.deleteCategoryHandler = exports.updateCategoryHandler = exports.getCategoryHandler = exports.getAllCategoryHandler = exports.createCategoryHandler = void 0;
const lodash_1 = require("lodash");
const category_service_1 = require("../services/category.service");
const httpException_1 = __importDefault(require("../utils/httpException"));
function createCategoryHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const category = yield (0, category_service_1.createCategory)(req.body);
            res
                .status(201)
                .json({ message: "Tạo danh mục thành công !", data: category });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.createCategoryHandler = createCategoryHandler;
function getAllCategoryHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categories = yield (0, category_service_1.getAllCategory)(req.query);
            res.json({
                countDocument: categories.length,
                resultPerPage: req.query.limit ? req.query.limit * 1 : 0,
                data: categories,
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getAllCategoryHandler = getAllCategoryHandler;
function getCategoryHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const category = yield (0, category_service_1.getCategory)((0, lodash_1.get)(req.params, "categoryId"));
            if (!category) {
                return next(new httpException_1.default(404, "Không tìm thấy danh mục !"));
            }
            res.json(category);
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.getCategoryHandler = getCategoryHandler;
function updateCategoryHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const category = yield (0, category_service_1.updateCategory)({ _id: (0, lodash_1.get)(req.params, "categoryId") }, req.body, { new: true });
            if (!category)
                return next(new httpException_1.default(404, "Không tìm thấy danh mục !"));
            res.json({
                message: "Cập nhật danh mục thành công !",
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.updateCategoryHandler = updateCategoryHandler;
function deleteCategoryHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, category_service_1.deleteCategory)((0, lodash_1.get)(req.params, "categoryId"));
            res.json({
                message: "Đã xóa danh mục thành công !",
            });
        }
        catch (error) {
            next(new httpException_1.default(500, error.message));
        }
    });
}
exports.deleteCategoryHandler = deleteCategoryHandler;
