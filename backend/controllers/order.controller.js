const mongoose = require("mongoose");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.createOrder = async (req, res, next) => {
    try {
        const { deliveryAddress } = req.body;

        if (
            typeof deliveryAddress !== "string" ||
            deliveryAddress.trim().length < 5 ||
            deliveryAddress.trim().length > 500
        ) {
            return res.status(400).json({
                message: "Enter a valid delivery address"
            });
        }

        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.food");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Your cart is empty"
            });
        }

        let subtotalCents = 0;
        const orderItems = [];

        for (const item of cart.items) {
            if (!item.food || !item.food.isAvailable) {
                return res.status(400).json({
                    message: "A food item is unavailable"
                });
            }

            const unitPriceCents = Math.round(
                item.food.price * 100
            );

            subtotalCents += unitPriceCents * item.quantity;

            orderItems.push({
                food: item.food._id,
                name: item.food.name,
                quantity: item.quantity,
                unitPrice: unitPriceCents / 100
            });
        }

        const subtotal = subtotalCents / 100;
        const deliveryFee = 40;
        const tax = Math.round(subtotalCents * 0.05) / 100;
        const total = subtotal + deliveryFee + tax;

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            deliveryAddress: deliveryAddress.trim(),
            subtotal,
            deliveryFee,
            tax,
            total
        });

        cart.items = [];
        await cart.save();

        res.status(201).json({
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        next(error);
    }
};

exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        res.json({ orders });
    } catch (error) {
        next(error);
    }
};

exports.getMyOrderById = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({ order });
    } catch (error) {
        next(error);
    }
};