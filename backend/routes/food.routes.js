const express = require("express");
const router = express.Router();

const {
    getFoods,
    getFoodById
} = require("../controllers/food.controller");

router.get("/", getFoods);
router.get("/:id", getFoodById);

module.exports = router;