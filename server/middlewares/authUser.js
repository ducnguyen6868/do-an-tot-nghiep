const jwt = require("jsonwebtoken");

// Middleware check token user 
function verifyUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Access denied. No token provided."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; // 
    next(); 
  } catch (err) {
    return res.status(403).json({
      status: "error",
      message: "Invalid or expired token."
    });
  }
}

module.exports = verifyUser;
