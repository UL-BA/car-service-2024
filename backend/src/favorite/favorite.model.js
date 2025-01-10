const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop', required: true }
}, { timestamps: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
