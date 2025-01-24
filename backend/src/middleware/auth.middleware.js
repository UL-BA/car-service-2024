const admin = require("../../firebase-admin"); // Import the initialized instance

const verifyAdminToken = async (req, res, next) => {
  try {
      const token = req.headers.authorization?.split('Bearer ')[1];
      if (!token) {
          return res.status(401).json({ message: 'No token provided' });
      }

      const decodedToken = await admin.auth().verifyIdToken(token);
      if (decodedToken.role !== 'admin') {
          return res.status(403).json({ message: 'Access denied' });
      }

      req.user = decodedToken;
      next();
  } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
  }
};


module.exports = { verifyAdminToken };
