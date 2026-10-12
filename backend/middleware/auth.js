const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function protect(req, res, next) {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Please log in first"
            });
        }

        const token = header.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId)
            .select("_id name email role");

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (["JsonWebTokenError", "TokenExpiredError"].includes(error.name)) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        next(error);
    }
}

function adminOnly(req, res, next) {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required"
        });
    }

    next();
}

module.exports = { protect, adminOnly };