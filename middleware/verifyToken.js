import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🧾 Auth Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("⛔ No token or bad format");
    return res.status(401).json({ error: "Token missing or invalid format" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ Token verification failed:", err.message);
      return res.status(401).json({ error: "Invalid token" });
    }

    console.log("✅ Token verified:", decoded);
    req.user = decoded;
    next();
  });
};

export default authMiddleware;
