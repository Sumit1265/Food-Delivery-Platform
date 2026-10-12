const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");

const {
    createOrder,
    getMyOrders,
    getMyOrderById
} = require("../controllers/order.controller");

router.use(protect);

router.post("/", createOrder);
router.get("/", getMyOrders);
router.get("/:id", getMyOrderById);

module.exports = router;