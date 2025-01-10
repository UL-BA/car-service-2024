const express = require("express");
const { getFavorites, addFavorite, removeFavorite } = require("./favorite.controller");
const router = express.Router();

router.get("/:userId", getFavorites);
router.post("/", addFavorite);
router.delete("/", removeFavorite);

module.exports = router;
