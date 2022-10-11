"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("../controllers/review.controller");
const middlewares_1 = require("../middlewares");
const review_schema_1 = require("../schemas/review.schema");
const router = express_1.default.Router();
//  CREATE NEW REVIEW
router.post("/review/new", [middlewares_1.requiresUser, (0, middlewares_1.validateRequest)(review_schema_1.createReviewSchema)], review_controller_1.createReviewHandler);
// GET ALL REVIEW
router.get("/reviews", review_controller_1.getAllReviewHandler);
// GET REVIEW
router.get("/review/:reviewId", (0, middlewares_1.validateRequest)(review_schema_1.getReviewSchema), review_controller_1.getReviewHandler);
// GET ALL REVIEW BY PRODUCT
router.get("/reviews/:productId", (0, middlewares_1.validateRequest)(review_schema_1.getAllReviewByProductSchema), review_controller_1.getAllReviewByProduct);
// UPDATE REVIEW
router.put("/review/:reviewId", [middlewares_1.requiresUser, (0, middlewares_1.validateRequest)(review_schema_1.updateReviewSchema)], review_controller_1.updateReviewHandler);
router.patch("/review/restore/:reviewId", [middlewares_1.requiresUser, (0, middlewares_1.validateRequest)(review_schema_1.updateReviewSchema)], review_controller_1.restoreReviewHandler);
// SOFT DELETE REVIEW
router.delete("/review/:reviewId", [middlewares_1.requiresUser, (0, middlewares_1.validateRequest)(review_schema_1.deleteReviewSchema)], review_controller_1.destroyReviewHandler);
router.delete("/review/force/:reviewId", [middlewares_1.requiresUser, (0, middlewares_1.validateRequest)(review_schema_1.deleteReviewSchema)], review_controller_1.forceDestroyReviewHandler);
exports.default = router;
