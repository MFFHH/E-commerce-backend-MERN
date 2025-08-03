import express from "express";
import {
    getAllProducts,
    getFeaturedProducts,
    getRecommendedProducts,
    getProductsByCategory,
    createProduct,
    deleteProduct,
    toggleFeatureProduct,
} from "../controllers/product.controller.js"; // Importing the controller for product operations
import { protectedRoute, adminRoute } from "../middleware/auth.middleware.js"; // Importing middlewares for authentication and authorization

const router = express.Router();

router.get("/", protectedRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/", protectedRoute, adminRoute, createProduct);
router.delete("/:id", protectedRoute, adminRoute, deleteProduct);
router.patch("/:id", protectedRoute, adminRoute, toggleFeatureProduct);

export default router;
