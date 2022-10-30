"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const catalog_controller_1 = require("../controllers/catalog.controller");
const middlewares_1 = require("../middlewares");
const catalog_schema_1 = require("../schemas/catalog.schema");
const router = express_1.default.Router();
// * CREATE CATALOG
router.post("/admin/catalog/new", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(catalog_schema_1.createCatalogSchema)], catalog_controller_1.createCatalogHandler);
// * GET ALL CATALOG --- PAGINATION
router.get("/catalogs", catalog_controller_1.getAllCatalogHandler);
// * GET CATALOG DETAILS
router.get("/catalog/:catalogId", (0, middlewares_1.validateRequest)(catalog_schema_1.getCatalogSchema), catalog_controller_1.getCatalogHandler);
// * UPDATE CATALOG
router.put("/admin/catalog/:catalogId", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(catalog_schema_1.updateCatalogSchema)], catalog_controller_1.updateCatalogHandler);
// * DELETE CATALOG
router.delete("/admin/catalog/:catalogId", [middlewares_1.requiresAdmin, (0, middlewares_1.validateRequest)(catalog_schema_1.deleteCatalogSchema)], catalog_controller_1.deleteCatalogHandler);
exports.default = router;
