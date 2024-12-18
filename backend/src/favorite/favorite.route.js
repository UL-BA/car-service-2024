const express = require("express");
const { getFavorites, addFavorite, removeFavorite } = require("./favorite.controller"); // Ensure these are correctly imported
const router = express.Router();

router.get("/:userId", getFavorites); // Get all favorites for a user
router.post("/", addFavorite); // Add an item to favorites
router.delete("/", removeFavorite); // Remove an item from favorites

module.exports = router;
