const Cart = require("../models/cart");
const Food = require("../models/food");

exports.getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.food");

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const items = cart.items
            .filter(item => item.food)
            .map(item => ({
                id: item._id,
                foodId: item.food._id,
                name: item.food.name,
                price: item.food.price,
                quantity: item.quantity,
                lineTotal: Number(
                    (item.food.price * item.quantity).toFixed(2)
                )
            }));

        const subtotal = Number(
            items.reduce((sum, item) => sum + item.lineTotal, 0)
                .toFixed(2)
        );

        res.json({ items, subtotal });
    } catch (error) {
        next(error);
    }
};

exports.addToCart = async (req, res, next) => {
    try {
        const { foodId, quantity = 1 } = req.body;

        if (
            typeof foodId !== "string" ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > 50
        ) {
            return res.status(400).json({
                message: "Invalid food ID or quantity"
            });
        }

        const food = await Food.findOne({
            _id: foodId,
            isAvailable: true
        });

        if (!food) {
            return res.status(404).json({
                message: "Food item unavailable"
            });
        }

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const existing = cart.items.find(
            item => item.food.toString() === foodId
        );

        if (existing) {
            if (existing.quantity + quantity > 50) {
                return res.status(400).json({
                    message: "Maximum quantity is 50"
                });
            }

            existing.quantity += quantity;
        } else {
            cart.items.push({ food: foodId, quantity });
        }

        await cart.save();

        res.json({ message: "Cart updated" });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid food ID"
            });
        }

        next(error);
    }
};

exports.updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;

        if (
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > 50
        ) {
            return res.status(400).json({
                message: "Quantity must be between 1 and 50"
            });
        }

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const item = cart.items.id(req.params.id);

        if (!item) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        item.quantity = quantity;
        await cart.save();

        res.json({ message: "Quantity updated" });
    } catch (error) {
        next(error);
    }
};

exports.removeCartItem = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const item = cart.items.id(req.params.id);

        if (!item) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        item.deleteOne();
        await cart.save();

        res.json({ message: "Item removed" });
    } catch (error) {
        next(error);
    }
};