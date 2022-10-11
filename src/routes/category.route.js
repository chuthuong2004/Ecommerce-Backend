"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const middlewares_1 = require("../middlewares");
const category_model_1 = __importDefault(require("../models/category.model"));
const category_schema_1 = require("../schemas/category.schema");
const router = express_1.default.Router();
// * GET ALL CATEGORY --- PAGINATION
router.get("/categories", category_controller_1.getAllCategoryHandler);
// * GET CATEGORY DETAILS
router.get("/category/:categoryId", (0, middlewares_1.validateRequest)(category_schema_1.getCategorySchema), category_controller_1.getCategoryHandler);
// * CREATE CATEGORY --- ADMIN
router.post("/admin/category/new", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(category_schema_1.createCategorySchema)], category_controller_1.createCategoryHandler);
// * UPDATE CATEGORY --- ADMIN
router.put("/admin/category/:categoryId", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(category_schema_1.updateCategorySchema)], category_controller_1.updateCategoryHandler);
// ! DELETE CATEGORY --- ADMIN
router.delete("/admin/category/:categoryId", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(category_schema_1.deleteCategorySchema)], category_controller_1.deleteCategoryHandler);
router.get("/admin/categories/update", middlewares_1.requiresAdmin, (req, res) => {
    const cate = category_model_1.default.findOne({ gender: ["man", "woman", "unisex"] });
    return res.status(200).json(cate);
});
exports.default = router;
