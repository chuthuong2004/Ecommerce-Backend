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
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const middlewares_1 = require("../middlewares");
const product_model_1 = __importDefault(require("../models/product.model"));
const product_schema_1 = require("../schemas/product.schema");
const router = express_1.default.Router();
// * CREATE PRODUCT --- DONE
router.post("/admin/product/new", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(product_schema_1.createProductSchema)], product_controller_1.createProductHandler);
router.get("/products", product_controller_1.getAllProductHandler);
// * GET PRODUCT DETAIL --- DONE
router.get("/product/:productId", (0, middlewares_1.validateRequest)(product_schema_1.getProductSchema), product_controller_1.getProductHandler);
router.get("/product/slug/:slug", 
// validateRequest(getProductSchema),
product_controller_1.getProductBySlugHandler);
// * UPDATE PRODUCT ---- ADMIN ---DONE
router.put("/admin/product/:productId", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(product_schema_1.updateProductSchema)], product_controller_1.updateProductHandler);
// * UPDATE PRODUCTS FAVORITES
// * add favorite --- DONE
router.put("/products/favorite/add/:productId", [middlewares_1.requiresUser, (0, middlewares_1.validateRequest)(product_schema_1.updateProductSchema)], product_controller_1.addFavoriteHandler);
// * remove favorite --- DONE
router.put("/products/favorite/remove/:productId", [middlewares_1.requiresUser, (0, middlewares_1.validateRequest)(product_schema_1.updateProductSchema)], product_controller_1.removeFavoriteHandler);
// * RESTORE PRODUCT
router.patch("/admin/product/restore/:productId", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(product_schema_1.restoreProductSchema)], product_controller_1.restoreProductHandler);
// * SOFT DELETE PRODUCT
router.delete("/admin/product/:productId", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(product_schema_1.deleteProductSchema)], product_controller_1.deleteProductHandler);
// ! DELETE PRODUCT ---- delete image
router.delete("/admin/product/force/:productId", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(product_schema_1.deleteProductSchema)], product_controller_1.forceDestroyProductHandler);
router.put("/updateMany", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield product_model_1.default.updateMany({ gender: "woman" }, { gender: "women" });
        res.send("ok");
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.default = router;
