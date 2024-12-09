const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    firebaseUID: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;