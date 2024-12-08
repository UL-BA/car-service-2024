const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cors({
    origin: '*',  // Temporarily allow all origins
    credentials: true
}));

// Connect to MongoDB first
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s
})
.then(() => {
    console.log("MongoDB connected successfully!");
    
    // Only set up routes after DB connection is established
    const workshopRoutes = require('./src/cars/workshop.route');
    app.use("/api/workshop", workshopRoutes);
    
    app.get("/", (req, res) => {
        res.json({ message: "Road Ready Server is running!" });
    });

    // Start server after DB connection
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
})
.catch(err => {
    console.error("MongoDB connection error:", err);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});