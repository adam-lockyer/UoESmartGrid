const express = require("express");
const router = express.Router();
const config = require("config");
const Influx = require("influx");
const influx = new Influx.InfluxDB(
	`http://${config.get("DATABASE_USERNAME")}:${config.get(
		"DATABASE_PASSWORD"
	)}@localhost:8086/SmartGrid`
);

// /api/rooms/reading
router.get("/reading", async (req, res) => {
	const { Room } = req.query;
	return res.json({
		Room,
		readings: await influx.query(
			`SHOW MEASUREMENTS WHERE "room"='${Room}'`
		),
	});
});

// /api/rooms/:building
router.get("/:building", [], async (req, res) => {
	const { building } = req.params;
	return res.json({
		building,
		room: await influx.query(
			`SHOW TAG VALUES WITH KEY=room WHERE "building"='${building}'`
		),
	});
});

module.exports = router;
