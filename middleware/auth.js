const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
	// Get JWT token from header
	const token = req.header("x-auth-token");
	// check if no token
	if (!token) {
		return res.status(401).json({ msg: "No token provided" });
	}
	// Verify token
	try {
		const decoded = jwt.verify(token, config.get("jwtSecret"));
		req.id = decoded.user;
		next();
	} catch (error) {
		res.status(401).json({ msg: "Token is invalid." });
	}
};
