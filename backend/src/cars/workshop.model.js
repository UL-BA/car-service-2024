const mongoose = require('mongoose');

// Add timestamps for better tracking
const workshopSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethods: { type: [String], required: true },
    services: { type: [String], required: true },
    acceptedBrands: { type: [String], required: true }
}, { timestamps: true });

const Workshop = mongoose.model('Workshop', workshopSchema);

module.exports = Workshop;
