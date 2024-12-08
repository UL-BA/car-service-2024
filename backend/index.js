const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true
}));

// MongoDB connection options
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 5000,
};

// Connect to MongoDB
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.DB_URL, mongoOptions);
        isConnected = true;
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

// Routes
const workshopRoutes = require('./src/cars/workshop.route');

// Initialize routes
app.use("/api/workshop", async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed' });
    }
}, workshopRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Road Ready Server is running!" });
});

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

module.exports = app;