const { response } = require("express");
const express = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const idGen = require("../util/idGenerator");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Influx = require("influx");
const influx = new Influx.InfluxDB({
	host: "localhost",
	port: 8086,
	protocol: "http",
	database: "SmartGrid",
});

// Login
router.post("/login", async (req, res) => {
	const { user, password } = req.body;
	const query = `SELECT * FROM "users" WHERE username='${user}'`;
	const result = await influx.query(query);
	const foundUser = result[0];
	if (!foundUser)
		return res
			.status(404)
			.json({ errors: [{ msg: "Username or password is incorrect" }] });
	const isMatch = await bcrypt.compare(password, foundUser.password);
	console.log(isMatch);
	if (isMatch) {
		// Generate Token and send back
		const payload = {
			user: foundUser.id,
		};
		const token = jwt.sign(payload, config.get("jwtSecret"), {
			expiresIn: config.get("jwtExpiry"),
		});
		console.log(token);
		return res.json({ token });
	} else {
		return res
			.status(400)
			.json({ errors: [{ msg: "Username or password is incorrect" }] });
	}
});

// Get a user from DB
router.get("/loadUser/:token", auth, async (req, res) => {
	const query = `SELECT username FROM "users" WHERE id='${req.id}'`;
	const result = await influx.query(query);
	return res.json(result[0]);
});

// Create new user
router.post("/create", async (req, res) => {
	const { user, password } = req.body;
	const id = idGen(20);
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	try {
		await influx.writePoints([
			{
				measurement: "users",
				tags: {
					id: id,
				},
				fields: {
					password: hashedPassword,
					username: user,
				},
			},
		]);
		const selectionQuery = `SELECT username FROM "users" WHERE id='${id}'`;
		const result = await influx.query(selectionQuery);
		return res.json(result[0]);
	} catch (error) {
		console.log(error);
		return res.send("error");
	}
});

module.exports = router;
