const express = require("express");
const router = express.Router();
const config = require("config");
const Influx = require("influx");
const influx = new Influx.InfluxDB(
	`http://${config.get("DATABASE_USERNAME")}:${config.get(
		"DATABASE_PASSWORD"
	)}@localhost:8086/SmartGrid`
);

router.get("/:building", [], async (req, res) => {
	const { building } = req.params;
	const { StartDate, EndDate, room, reading } = req.query;

	const startDateAdj = +StartDate * 1000000;
	let endDateAdj = +EndDate * 1000000;
	const queryTime = `SELECT first(reading) FROM ${reading} WHERE room='${room}'`;
	let timeRes;
	try {
		timeRes = await influx.query(queryTime);
	} catch (error) {
		console.log(error);
	}
	if (!timeRes) {
		return res.json({
			error: "Error",
		});
	}
	const firstTime = timeRes[0].time._nanoISO;
	const firstEpoch = Date.parse(firstTime);
	const firstNano = firstEpoch * 1000000;

	let grouping = "1h";
	if (
		startDateAdj - endDateAdj >= 259200000000000 &&
		startDateAdj - endDateAdj < 2500000000000000
	) {
		grouping = "2h";
	} else if (
		startDateAdj - endDateAdj >= 2500000000000000 &&
		startDateAdj - endDateAdj < 15552000000000000
	) {
		grouping = "12h";
	} else if (
		startDateAdj - endDateAdj >= 21536000000000000 &&
		startDateAdj - endDateAdj < 31537000000000000
	) {
		grouping = "7d";
	} else if (startDateAdj - endDateAdj > 31536000000000000) {
		grouping = "30d";
	}
	if (endDateAdj < firstNano) {
		endDateAdj = firstNano;
	}
	const query = `SELECT mean("reading") AS "reading" FROM ${reading} WHERE time > ${endDateAdj} AND time < ${startDateAdj} AND room='${room}' GROUP BY time(${grouping})`;
	const result = await influx.query(query);
	const cons = result.filter((con) => con.reading !== null);
	return res.json({
		building: building,
		room: room,
		consumption: cons,
		grouping: grouping,
	});
});

module.exports = router;
