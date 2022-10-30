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
exports.deleteCatalog = exports.updateCatalog = exports.getCatalog = exports.getAllCatalog = exports.createCatalog = void 0;
const catalog_model_1 = __importDefault(require("../models/catalog.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const ApiFeatures_1 = __importDefault(require("../utils/ApiFeatures"));
function createCatalog(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const catalog = new catalog_model_1.default(input);
        return yield catalog.save();
    });
}
exports.createCatalog = createCatalog;
function getAllCatalog(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const features = new ApiFeatures_1.default(catalog_model_1.default.find(), 
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
exports.getAllCatalog = getAllCatalog;
function getCatalog(catalogId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const catalog = yield catalog_model_1.default.findById(catalogId).populate({
                path: "categories",
                // populate: {
                // path: "products",
                //       populate: { path: "reviews", populate: { path: "user" } },
                // },
            });
            return catalog;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getCatalog = getCatalog;
function updateCatalog(filter, update, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const catalog = yield catalog_model_1.default.findOneAndUpdate(filter, update, options);
            return yield (catalog === null || catalog === void 0 ? void 0 : catalog.save());
        }
        catch (error) {
            throw error;
        }
    });
}
exports.updateCatalog = updateCatalog;
function deleteCatalog(catalogId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield category_model_1.default.updateMany({ catalog: catalogId }, { catalog: null });
            yield catalog_model_1.default.findByIdAndDelete(catalogId);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.deleteCatalog = deleteCatalog;
