const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Firebase UID or unique identifier
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true }, // References an item in the "Workshop" collection
});

module.exports = mongoose.model("Favorite", favoriteSchema);
