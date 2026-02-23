const express = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const idGen = require("../util/idGenerator");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Influx = require("influx");
const connectDB = require("../lib/mongo");
const { ObjectId } = require('mongodb');
// const influx = new Influx.InfluxDB(
// 	`http://${config.get("DATABASE_USERNAME")}:${config.get(
// 		"DATABASE_PASSWORD"
// 	)}@localhost:8086/SmartGrid`
// );
const influx = {};

const client = connectDB();
const database = client.db("website_users");
const userCollection = database.collection('users');

// Login
router.post("/login", async (req, res) => {
	try {
		const { user, password } = req.body;
		if (!user) return res.status(400).send('Exited');
		if (user !== "admin")
			return res
				.status(400)
				.json({ errors: [{ msg: "Username or password is incorrect" }] });
		const foundUser = await userCollection.findOne({ username: user });
		if (!foundUser)
			return res
				.status(404)
				.json({ errors: [{ msg: "Username or password is incorrect" }] });
		console.log(password, foundUser.password);
		const isMatch = await bcrypt.compare(password, foundUser.password);
	
		if (isMatch) {
			// Generate Token and send back
			const payload = {
				user: foundUser._id,
			};
			const token = jwt.sign(payload, config.get("jwtSecret"), {
				expiresIn: config.get("jwtExpiry"),
			});
			return res.json({ token });
		} else {
			return res
				.status(400)
				.json({ errors: [{ msg: "Username or password is incorrect" }] });
		}
	} catch (e) {
		console.log(e);
		return res
		.status(500)
		.json({ errors: [{ msg: "An unexpected error occurred" }] });
	}
});

// Get a user from DB
router.get("/loadUser/:token", auth, async (req, res) => {
	const uid = new ObjectId(req.id);
	const result = await userCollection.find({ _id: uid }).project({ password: 0 }).toArray();
	return res.status(200).json(result[0]);
});

// Create new user
router.post("/create", async (req, res) => {
	const { user, password } = req.body;
	const id = idGen(20);
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const userObject = {
		password: hashedPassword,
		username: user,
	}
	try {
		const insertedDocument = await userCollection.insertOne(userObject);
		return res.send('success');
	} catch (error) {
		console.error(error);
		return res.send("error");
	}
});

module.exports = router;
