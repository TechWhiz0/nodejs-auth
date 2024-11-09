const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];
  
  // Check if token is provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided. Please log in to continue."
    });
  }

  try {
    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userInfo = decodedToken; // Attach decoded token info to req object
    next(); // Proceed to next middleware or route handler
  } catch (e) {
    console.error("Token verification failed:", e.message); // Log error message
    return res.status(401).json({
      success: false,
      message: "Access denied. Invalid or expired token. Please log in again."
    });
  }
};

module.exports = authMiddleware;
