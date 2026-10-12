const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");

const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem
} = require("../controllers/cart.controller");

router.use(protect);

router.get("/", getCart);
router.post("/items", addToCart);
router.patch("/items/:id", updateCartItem);
router.delete("/items/:id", removeCartItem);

module.exports = router;