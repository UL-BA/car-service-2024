const express = require("express");
const multer = require("multer");
const path = require("path");
const Icon = require("./src/icons/icon.model");
const { v4: uuidv4 } = require("uuid");

const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const userRoutes = require("./src/users/user.route");
const workshopRoutes = require("./src/cars/workshop.route");
const favoriteRoutes = require("./src/favorite/favorite.route");
const adminRoutes = require('./src/admin/admin.route');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "userPhoto/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);

app.use('/api/admin', adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workshop", workshopRoutes);
app.use("/api/favorites", favoriteRoutes);

app.use("/userPhoto", express.static("userPhoto"));

app.post("/api/workshop/create-workshop", async (req, res) => {
  try {
    const { name, description, address, pricing, phone } = req.body;

    // Validate required fields
    if (!name || !description || !address || !pricing || !phone || !id) {
      return res.status(400).json({
          message: "All fields (name, description, address, pricing, phone, id) are required.",
      });
  }

    // Generate id if not provided
    const id = req.body.id || uuidv4();

    // Create a new workshop
    const newWorkshop = new Workshop({ ...req.body, id });
    await newWorkshop.save();

    res.status(201).json({
      message: "Workshop created successfully",
      data: newWorkshop,
    });
  } catch (error) {
    console.error("Error while creating workshop:", error);
    res.status(500).json({
      message: "Failed to create workshop.",
      error: error.message || error,
    });
  }
});



app.post("/upload", upload.single("profilePhoto"), async (req, res) => {
  if (req.file) {
    const fileUrl = `http://localhost:3000/userPhoto/${req.file.filename}`;
    const email = req.body.email;

    try {
      console.log("Looking for user with email:", email);
      let icon = await Icon.findOne({ email: email });

      if (!icon) {
        console.log("User not found. Creating user...");
        icon = new Icon({ email: email, profilePhoto: fileUrl });
        await icon.save();
      } else {
        console.log("User found. Updating profile photo...");
        icon.profilePhoto = fileUrl;
        await icon.save();
      }

      res.json({ photoUrl: fileUrl });
    } catch (error) {
      console.error("Error updating user profile photo:", error);
      res.status(500).send("Server error");
    }
  } else {
    console.error("No file uploaded");
    res.status(400).send("No file uploaded");
  }
});

app.get("/api/users/:email", async (req, res) => {
  const email = req.params.email;

  try {
    let icon = await Icon.findOne({ email });

    if (!icon) {
      console.log("User not found, creating new user...");

      icon = new Icon({ email, profilePhoto: null });
      await icon.save();
    }
    res.json({ profilePhoto: icon.profilePhoto });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Error fetching user data", error });
  }
});

app.get("/", (req, res) => {
  res.send("Road Ready Server is running!");
});

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
