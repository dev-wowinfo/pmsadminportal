import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  console.log("AUTH MIDDLEWARE HIT:", req.method, req.originalUrl);
  const authHeader = req.headers.authorization;

  // ❌ No token
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access token required"
    });
  }

  // Supports: Bearer <token>
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  jwt.verify(
    token,
    process.env.JWT_SECRET || "my_secret_key",
    (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token"
        });
      }

      req.user = decoded; // attach user info
      next(); // ✅ allow request
    }
  );
};

export default authenticateToken;
