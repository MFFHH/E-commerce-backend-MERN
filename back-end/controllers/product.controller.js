import express from "express";
import Product from "../models/Product.model.js";
import { Redis } from "../lib/redis.js"; // Importing Redis client
import cloudinary from "../lib/cloudinary.js"; // Importing Cloudinary for image uploads

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        let FeatruredProducts = await Redis.get(featured_products);
        if (FeatruredProducts) {
            return res.json(JSON.parse(FeatruredProducts));
        }
        // If not found in Redis, fetch from database
        FeatruredProducts = await Product.find({ isFeatured: true }).lean();
        if (!FeatruredProducts) {
            res.status(404).json({ message: "No featured products found" });
        }
        //store featured products in Redis for caching
        await Redis.set("featured_products", JSON.stringify(FeatruredProducts));
        res.json(FeatruredProducts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, descrition, price, image, category } = req.body;
        let cloudinaryImage = null;
        if (image) {
            // Upload image to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(image, {
                folder: "products",
            });
            cloudinaryImage = uploadResult.secure_url; // Get the secure URL of the uploaded image
        }
        const newProduct = await Product.create({
            name,
            description: descrition,
            price,
            image: cloudinaryImage,
            category,
        });

        res.status(201).json({
            message: "Product created successfully",
            product: newProduct,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById()(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Delete product image from Cloudinary if it exists
        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0]; // Extract public ID from the image URL
            await cloudinary.uploader.destroy(`products/${publicId}`);
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 3 }, // Randomly select 3 products
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    price: 1,
                    image: 1,
                    category: 1,
                },
            },
        ]);

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const toggleFeatureProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured; // Toggle the isFeatured status
            const updatedProduct = await product.save();
            await updatedProductCache();
            res.json({
                message: "Product feature status updated",
                product: updatedProduct,
            });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

async function updatedProductCache() {
    try {
        const featuredProducts = await Product.find({
            isFeatured: true,
        }).lean();
        await Redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.error("Error updating product cache:", error.message);
    }
}

export default getAllProducts;
