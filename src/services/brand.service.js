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
exports.deleteBrand = exports.updateBrand = exports.getBrand = exports.getAllBrand = exports.createBrand = void 0;
const brand_model_1 = __importDefault(require("../models/brand.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const ApiFeatures_1 = __importDefault(require("../utils/ApiFeatures"));
function createBrand(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const brand = new brand_model_1.default(input);
        return yield brand.save();
    });
}
exports.createBrand = createBrand;
function getAllBrand(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const features = new ApiFeatures_1.default(brand_model_1.default.find(), query)
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
exports.getAllBrand = getAllBrand;
function getBrand(brandId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const brand = yield brand_model_1.default.findById(brandId).populate({
                path: "products",
                populate: {
                    path: "brand",
                    select: "-products",
                },
            });
            return brand;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getBrand = getBrand;
function updateBrand(filter, update, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const brand = yield brand_model_1.default.findOneAndUpdate(filter, update, options);
            return yield (brand === null || brand === void 0 ? void 0 : brand.save());
        }
        catch (error) {
            throw error;
        }
    });
}
exports.updateBrand = updateBrand;
function deleteBrand(brandId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield product_model_1.default.updateMany({ brand: brandId }, { brand: null });
            yield brand_model_1.default.findByIdAndDelete(brandId);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.deleteBrand = deleteBrand;
