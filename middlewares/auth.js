// Token verification middleware

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // If the Authorization header is missing or has an invalid format
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1]; // "Bearer TOKEN" → TOKEN

    try {
        // Verify the token (check if it's a valid JWT)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Add user info (id, email, etc.) to the request object for later use in controllers
        req.user = decoded;
        // Proceed to the next middleware or controller
        next();
    } catch(err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};








module.exports = auth;