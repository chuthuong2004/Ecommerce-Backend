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
router.post(
  "/admin/catalog/new",
  [requiresAdmin, validateRequest(createCatalogSchema)],
  createCatalogHandler
);
// * GET ALL CATALOG --- PAGINATION
router.get("/catalogs", getAllCatalogHandler);

// * GET CATALOG DETAILS
router.get(
  "/catalog/:catalogId",
  validateRequest(getCatalogSchema),
  getCatalogHandler
);

// * UPDATE CATALOG
router.put(
  "/admin/catalog/:catalogId",
  [requiresAdmin, validateRequest(updateCatalogSchema)],
  updateCatalogHandler
);

// * DELETE CATALOG
router.delete(
  "/admin/catalog/:catalogId",
  [requiresAdmin, validateRequest(deleteCatalogSchema)],
  deleteCatalogHandler
);

export default router;
