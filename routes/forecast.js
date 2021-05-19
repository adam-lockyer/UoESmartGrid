const express = require("express");
const router = express.Router();
const fs = require("fs");
const axios = require("axios");
const moment = require("moment");
const { spawn, exec } = require("child_process");

// /api/forecast
router.post("/", [], async (req, res) => {
	const { building, room, reading } = req.body;
	if (building === null || room === null || reading === null)
		return res
			.status(400)
			.json({ errors: [{ msg: "Missing parameters" }] });
	const response = await axios.get(
		"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/50.73596452499558%2C%20-3.534456330397626?unitGroup=uk&key=X3SP63DXBLARJBRRF6PMBTYK6&include=fcst%2Chours"
	);
	const days = response.data.days;
	const weatherArray = [];
	for (const day of days) {
		const dayDate = moment(day.datetime, "YYYY-MM-DD");
		for (const hour of day.hours) {
			const datetime = `${day.datetime} ${hour.datetime}`;
			const date = moment(datetime, "YYYY-MM-DD hh:mm:ss");
			const formattedDate = date.toISOString().substring(0, 19) + "Z";
			if (moment() > date) continue;
			if (moment().add(14, "d") < date) continue;
			const currentHourArray = [
				formattedDate,
				hour.winddir,
				hour.windspeed,
				hour.cloudcover,
				hour.temp,
				hour.pressure,
				hour.humidity,
			];
			weatherArray.push(currentHourArray);
		}
	}
	const stringifiedArray = JSON.stringify(weatherArray);
	await fs.writeFileSync("python_ann/data.txt", stringifiedArray);
	exec(
		`py python_ann/predict.py ${building} ${room} ${reading}`,
		(err, stdout, stderr) => {
			if (err) console.error(err.stack);
			return res.status(200).json(JSON.parse(stdout));
		}
	);
});

module.exports = router;
