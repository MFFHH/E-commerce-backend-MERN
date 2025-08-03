import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // Importing cookie-parser for handling cookies

import authroutes from "./routes/auth.routes.js"; // Importing the auth routes
import productRoutes from "./routes/product.routes.js"; // Importing product routes
import cartRoutes from "./routes/cart.routes.js"; // Importing cart routes

import { connectDB } from "./lib/db.js"; // Importing the database connection function

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000

app.use(express.json()); // Middleware to parse JSON requests
app.use(cookieParser()); // Middleware to parse cookies

app.use("/api/auth", authroutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ` + PORT);

    connectDB(); // Connect to the database
});
