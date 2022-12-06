import express from "express";
import {
  createCatalogHandler,
  deleteCatalogHandler,
  getAllCatalogHandler,
  getCatalogHandler,
  updateCatalogHandler,
} from "../controllers/catalog.controller";
import { requiresAdmin, validateRequest } from "../middlewares";
import {
  createCatalogSchema,
  deleteCatalogSchema,
  getCatalogSchema,
  updateCatalogSchema,
} from "../schemas/catalog.schema";
const router = express.Router();

// * CREATE CATALOG
// POST /api/v1/admin/catalog/new
router.post(
  "/admin/catalog/new",
  [requiresAdmin, validateRequest(createCatalogSchema)],
  createCatalogHandler
);
// * GET ALL CATALOGS
// GET /api/v1/catalogs
router.get("/catalogs", getAllCatalogHandler);

// * GET CATALOG DETAILS
// GET /api/v1/catalog/:catalogId
router.get(
  "/catalog/:catalogId",
  validateRequest(getCatalogSchema),
  getCatalogHandler
);

// * UPDATE CATALOG
// PUT /api/v1/admin/catalog/:catalogId
router.put(
  "/admin/catalog/:catalogId",
  [requiresAdmin, validateRequest(updateCatalogSchema)],
  updateCatalogHandler
);

// * DELETE CATALOG
// DELETE /api/v1/admin/catalog/:catalogId
router.delete(
  "/admin/catalog/:catalogId",
  [requiresAdmin, validateRequest(deleteCatalogSchema)],
  deleteCatalogHandler
);

export default router;
