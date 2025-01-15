const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("No authorization header provided");
    return res.status(401).send("Access Denied: No Token Provided");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("No token provided");
    return res.status(401).send("Access Denied: No Token Provided");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.log("Token verification failed:", err.message);
    return res.status(400).send("Invalid Token");
  }
};

module.exports = authenticateToken;
