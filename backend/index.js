const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const userRoutes = require('./src/users/user.route');

// middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use("/api/users", userRoutes);
// routes
const workshopRoutes = require('./src/cars/workshop.route');

// Use routes
app.use("/api/workshop", workshopRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Road Ready Server is running!");
});

// MongoDB connection
mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("MongoDB connected successfully!");
        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });