import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res
                .status(401)
                .json({ message: "Access denied, no token provided" });
        }
        try {
            const decoded = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET
            );
            const user = await User.findById(decoded.userId).select(
                "-password"
            );
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            req.user = user; // Attach user to request object
            next();
        } catch (error) {
            if (error.name === "Token Expired Error") {
                return res.status(400).json({ message: "Invalid token" });
            }
            throw error;
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const adminRoute = async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else res.status(403).json({ message: "access denied" });
};
