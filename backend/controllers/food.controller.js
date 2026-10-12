const Food = require("../models/food");

exports.getFoods = async (req, res, next) => {
    try {
        const filter = { isAvailable: true };

        if (typeof req.query.category === "string") {
            filter.category = req.query.category;
        }

        if (typeof req.query.search === "string") {
            filter.name = {
                $regex: req.query.search.slice(0, 100),
                $options: "i"
            };
        }

        const foods = await Food.find(filter).limit(100);

        res.json({ foods });
    } catch (error) {
        next(error);
    }
};

exports.getFoodById = async (req, res, next) => {
    try {
        const food = await Food.findOne({
            _id: req.params.id,
            isAvailable: true
        });

        if (!food) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        res.json({ food });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid food ID"
            });
        }

        next(error);
    }
};