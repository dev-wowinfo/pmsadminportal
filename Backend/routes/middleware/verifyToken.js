import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  console.log("VERIFY TOKEN HIT:", req.method, req.originalUrl);
  console.log("AUTH HEADER:", req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  const token = authHeader.split(" ")[1];
  console.log("TOKEN:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default verifyToken;