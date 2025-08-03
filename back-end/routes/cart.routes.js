import express from "express"; // Importing express
import {
    addToCart,
    deleteFromCart,
    getCartItems,
    updateCartItem,
} from "../controllers/cart.controller.js"; // Importing the addToCart controller function
import { protectedRoute } from "../middleware/auth.middleware.js";
const router = express.Router(); // Creating a new router instance

router.post("/", protectedRoute, addToCart);
router.delete("/:id", protectedRoute, deleteFromCart); // Assuming delete is also handled by the same controller for simplicity
router.get("/", protectedRoute, getCartItems); // Assuming there's a function to get cart items
router.put("/:id", protectedRoute, updateCartItem); // Assuming there's a function to update cart items

export default router; // Exporting the router for use in other files
