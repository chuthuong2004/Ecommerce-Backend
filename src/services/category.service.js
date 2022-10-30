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
exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.getAllCategory = exports.createCategory = void 0;
const catalog_model_1 = __importDefault(require("../models/catalog.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const ApiFeatures_1 = __importDefault(require("../utils/ApiFeatures"));
function createCategory(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const category = yield category_model_1.default.create(input);
            if (input.catalog) {
                const catalog = yield catalog_model_1.default.findById(input.catalog);
                if (catalog)
                    yield catalog.updateOne({ $push: { categories: category._id } });
            }
            return category;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createCategory = createCategory;
function getAllCategory(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const features = new ApiFeatures_1.default(category_model_1.default.find(), 
            // .populate({
            //   path: "categories",
            //   populate: {
            //     path: "products",
            //     populate: {
            //       path: "reviews",
            //       populate: { path: "user" },
            //     },
            //   },
            // }),
            query)
                .paginating()
                .sorting()
                .searching()
                .filtering();
            return yield features.query;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getAllCategory = getAllCategory;
function getCategory(categoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const category = yield category_model_1.default.findById(categoryId).populate({
                path: "catalog",
            });
            // .populate({
            //   path: "products",
            // populate: { path: "reviews" },
            // });
            return category;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getCategory = getCategory;
function updateCategory(filter, update, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const category = yield category_model_1.default.findOne(filter);
            if (update.catalog !== String(category === null || category === void 0 ? void 0 : category.catalog)) {
                // nếu có catalog
                var currentCatalog = category === null || category === void 0 ? void 0 : category.catalog;
                // xóa category khỏi catalog cũ
                yield catalog_model_1.default.findOneAndUpdate({ _id: currentCatalog }, { $pull: { categories: category === null || category === void 0 ? void 0 : category._id } });
                // và đẩy category vào catalog mới
                const catalog = yield catalog_model_1.default.findById(update.catalog);
                yield (catalog === null || catalog === void 0 ? void 0 : catalog.updateOne({ $addToSet: { categories: category === null || category === void 0 ? void 0 : category._id } }));
            }
            const updatedCategory = yield category_model_1.default.findOneAndUpdate(filter, update, options);
            return yield (updatedCategory === null || updatedCategory === void 0 ? void 0 : updatedCategory.save());
        }
        catch (error) {
            throw error;
        }
    });
}
exports.updateCategory = updateCategory;
function deleteCategory(categoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield catalog_model_1.default.updateOne({
                categories: categoryId,
            }, {
                $pull: { categories: categoryId },
            });
            yield product_model_1.default.updateMany({
                category: categoryId,
            }, { category: null });
            yield category_model_1.default.findByIdAndDelete(categoryId);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.deleteCategory = deleteCategory;
