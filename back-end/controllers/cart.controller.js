import express from "express";
import Product from "../models/Product.model.js";

export const getCartItems = async (req, res) => {
    try {
        const produncts = await Product.find({
            _id: { $in: req.user.cartItems },
        });
        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find(
                (cartItem) => cartItem.id === product._id
            );
            return { ...product.toJSON(), quantity: item.quantity };
        });
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        const exisitProduct = await Product.find(
            (item) => item._id === productId
        );
        if (exisitProduct) {
            exisitProduct.quantity += 1; // Increment quantity if product already exists in cart
        } else {
            user.cartItems.push({
                productId,
                quantity: 1, // Add new product with quantity 1
            });
        }
        await user.save();
        res.status(201).json({
            message: "Product added to cart successfully",
            cart: user.cartItems,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        const exisitProduct = await Product.find(
            (item) => item._id === productId
        );
        if (!exisitProduct) {
            user.cartItems = []; // Clear cart if product not found
        } else {
            user.cartItems = user.cartItems.filter(
                (item) => item.productId !== productId
            ); // Remove product from cart
        }
        await user.save();
        res.status(200).json({
            message: "Product deleted from cart successfully",
            cart: user.cart,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;
        const cartItem = user.cartItems.find((item) => item.id === productId);
        if (cartItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter(
                    (item) => item.id !== productId
                ); // Remove item if quantity is 0
            }
            cartItem.quantity = quantity; // Update quantity
            await user.save();
            res.status(200).json({
                message: "Cart item updated successfully",
                cart: user.cartItems,
            });
        } else {
            res.status(404).json({ message: "Cart item not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
