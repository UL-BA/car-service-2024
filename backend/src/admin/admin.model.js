const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  pricing: { type: String, required: true },
  phone: { type: String, required: true },
  id: { type: String, required: true, unique: true},
  paymentMethods: { type: [String], default: [] },
  services: { type: [String], default: [] },
  acceptedBrands: { type: [String], default: [] },
});

module.exports = mongoose.model("Service", serviceSchema);
