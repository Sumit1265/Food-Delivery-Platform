require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://127.0.0.1:5500"
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        message: "FoodieHub backend is running"
    });
});

async function startServer() {
    try {
        await connectDB();

        app.listen(process.env.PORT || 5000, () => {
            console.log("Server running on port 5000");
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();



app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/foods", require("./routes/food.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/orders", require("./routes/order.routes"));