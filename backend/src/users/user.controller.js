const User = require("./user.model");
const admin = require("../../firebase-admin"); // Import the centralized Firebase Admin instance

const createOrUpdateUser = async (req, res) => {
    try {
        const { email, uid } = req.body;
        
        let user = await User.findOne({ firebaseUID: uid });
        
        if (!user) {
            user = new User({
                email,
                firebaseUID: uid,
                role: 'user'
            });
            await user.save();
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error in createOrUpdateUser:", error);
        res.status(500).json({ message: "Failed to process user" });
    }
};

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {
    createOrUpdateUser,
    verifyToken
};
