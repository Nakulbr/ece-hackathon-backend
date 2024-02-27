const jwt = require("jsonwebtoken");

const verifyToken = async function (req, res, next) {
  try {
    const reqPath = req.originalUrl.split("/");
    if (reqPath[3] === "login") {
      return next();
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "Authorization token must be attached" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === reqPath[2]) {
      req.user = decoded;
      next();
    } else {
      return res
        .status(403)
        .json({ error: "You are not authorized to access this resource" });
    }
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { verifyToken };
