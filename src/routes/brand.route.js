"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brand_controller_1 = require("../controllers/brand.controller");
const middlewares_1 = require("../middlewares");
const brand_schema_1 = require("../schemas/brand.schema");
const router = express_1.default.Router();
// * CREATE CATALOG
router.post("/admin/brand/new", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(brand_schema_1.createBrandSchema)], brand_controller_1.createBrandHandler);
// * GET ALL CATALOG --- PAGINATION
router.get("/brands", brand_controller_1.getAllBrandHandler);
// * GET CATALOG DETAILS
router.get("/brand/:brandId", (0, middlewares_1.validateRequest)(brand_schema_1.getBrandSchema), brand_controller_1.getBrandHandler);
// * UPDATE CATALOG
router.put("/admin/brand/:brandId", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(brand_schema_1.updateBrandSchema)], brand_controller_1.updateBrandHandler);
// * DELETE CATALOG
router.delete("/admin/brand/:brandId", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(brand_schema_1.deleteBrandSchema)], brand_controller_1.deleteBrandHandler);
exports.default = router;
