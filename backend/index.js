const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://car-service-front.vercel.app'  // Add your frontend Vercel URL
    ],
    credentials: true
}))
// Root route
app.get("/", (req, res) => {
    res.send("Road Ready Server is running!");
});

// routes
const workshopRoutes = require('./src/cars/workshop.route');
app.use("/api/workshop", workshopRoutes);

// MongoDB connection
mongoose.connect(process.env.DB_URL)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch(err => console.log("MongoDB connection error:", err));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});