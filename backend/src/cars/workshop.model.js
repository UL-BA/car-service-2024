const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethods: { type: [String], required: true }, // Array of strings for payment methods
    services: { type: [String], required: true }, // Array of strings for services
    acceptedBrands: { type: [String], required: true } // Array of strings for car brands
});

const Workshop = mongoose.model('Workshop', workshopSchema);

module.exports = Workshop;
