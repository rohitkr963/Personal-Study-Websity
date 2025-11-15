const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

function authenticateOptional(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return next();
  const parts = auth.split(" ");
  if (parts.length !== 2) return next();
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
  } catch (e) {
    // invalid token — ignore for optional auth
  }
  return next();
}

function authenticateRequired(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(401);
    return next(new Error("Authentication required"));
  }
  const parts = auth.split(" ");
  if (parts.length !== 2) {
    res.status(401);
    return next(new Error("Invalid authorization header"));
  }
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    return next();
  } catch (err) {
    res.status(401);
    return next(new Error("Invalid or expired token"));
  }
}

module.exports = { authenticateOptional, authenticateRequired };
