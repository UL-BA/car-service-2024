const mongoose = require("mongoose");

const iconSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  profilePhoto: { type: String },
});

const Icon = mongoose.model("Icon", iconSchema);

module.exports = Icon;
