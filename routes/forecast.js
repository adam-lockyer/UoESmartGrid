const express = require("express");
const router = express.Router();
const fs = require("fs");
const axios = require("axios");
const moment = require("moment");
const { spawn, exec } = require("child_process");
const config = require("config");
const Influx = require("influx");
const influx = new Influx.InfluxDB(
	`http://${config.get("DATABASE_USERNAME")}:${config.get(
		"DATABASE_PASSWORD"
	)}@localhost:8086/SmartGrid`
);
const Holidays = require("date-holidays");
const hd = new Holidays("GB");

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
	let weatherArray = [];
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
				hour.visibility,
				hour.temp,
				hour.pressure,
				hour.humidity,
			];
			weatherArray.push(currentHourArray);
		}
	}
	const endDate = moment().subtract(14, "d").valueOf() * 100000;
	const query = `SELECT reading FROM ${reading} WHERE time > ${endDate} AND building='${building}' AND room='${decodeURI(
		room
	)}'`;
	const results = await influx.query(query);

	// cons(hd.getHolidays(2020));
	const globalTrack = [0, 0];
	const WeekdayTrack = [0, 0, 0, 0];
	const NotHolidayTrack = [0, 0, 0, 0];
	const InOperatingHoursTrack = [0, 0, 0, 0];
	for (let i = 0; i < results.length; i++) {
		const result = results[i];
		datetime = moment(result.time._nanoISO, "YYYY-MM-DDTHH:mm:ssZ");
		const Weekday = datetime.days() === 0 || datetime.days() === 6 ? 0 : 1;
		const InOperatingHours =
			datetime.hour() < 6 || datetime.hour() > 19 ? 0 : 1;
		const hols = hd.getHolidays(datetime.year());
		const NotHoliday =
			hols.filter((hol) => {
				const formattedHoliday = moment(
					hol.date,
					"YYYY-MM-DD HH:mm:ss"
				).format("YYYY-MM-DD");
				const formattedCurrent = datetime.format("YYYY-MM-DD");
				return formattedHoliday === formattedCurrent;
			}).length === 0
				? 1
				: 0;
		if (result.reading != 0) {
			globalTrack[0] = globalTrack[0] + result.reading;
			globalTrack[1] = globalTrack[1] + 1;
			if (Weekday == 1) {
				WeekdayTrack[0] = WeekdayTrack[0] + result.reading;
				WeekdayTrack[1] = WeekdayTrack[1] + 1;
			} else {
				WeekdayTrack[2] = WeekdayTrack[2] + result.reading;
				WeekdayTrack[3] = WeekdayTrack[3] + 1;
			}
			if (NotHoliday == 1) {
				NotHolidayTrack[0] = NotHolidayTrack[0] + result.reading;
				NotHolidayTrack[1] = NotHolidayTrack[1] + 1;
			} else {
				NotHolidayTrack[2] = NotHolidayTrack[2] + result.reading;
				NotHolidayTrack[3] = NotHolidayTrack[3] + 1;
			}
			if (InOperatingHours == 1) {
				InOperatingHoursTrack[0] =
					InOperatingHoursTrack[0] + result.reading;
				InOperatingHoursTrack[1] = InOperatingHoursTrack[1] + 1;
			} else {
				InOperatingHoursTrack[2] =
					InOperatingHoursTrack[2] + result.reading;
				InOperatingHoursTrack[3] = InOperatingHoursTrack[3] + 1;
			}
		}
	}
	let WeekdayAvg = 0;
	let WeekendAvg = 0;
	let InOperatingHoursAvg = 0;
	let OutOperatingHoursAvg = 0;
	let NotHolidayAvg = 0;
	let HolidayAvg = 0;
	if (WeekdayTrack[0] != 0) {
		WeekdayAvg = WeekdayTrack[0] / WeekdayTrack[1];
	} else {
		WeekdayAvg = globalTrack[0] / globalTrack[1];
	}
	if (WeekdayTrack[2] != 0) {
		WeekendAvg = WeekdayTrack[2] / WeekdayTrack[3];
	} else {
		WeekendAvg = globalTrack[0] / globalTrack[1];
	}
	if (InOperatingHoursTrack[0] != 0) {
		InOperatingHoursAvg =
			InOperatingHoursTrack[0] / InOperatingHoursTrack[1];
	} else {
		InOperatingHoursAvg = globalTrack[0] / globalTrack[1];
	}
	if (InOperatingHoursTrack[2] != 0) {
		OutOperatingHoursAvg =
			InOperatingHoursTrack[2] / InOperatingHoursTrack[3];
	} else {
		OutOperatingHoursAvg = globalTrack[0] / globalTrack[1];
	}
	if (NotHolidayTrack[0] != 0) {
		NotHolidayAvg = NotHolidayTrack[0] / NotHolidayTrack[1];
	} else {
		NotHolidayAvg = globalTrack[0] / globalTrack[1];
	}
	if (NotHolidayTrack[2] != 0) {
		HolidayAvg = NotHolidayTrack[2] / NotHolidayTrack[3];
	} else {
		HolidayAvg = globalTrack[0] / globalTrack[1];
	}

	weatherArray = weatherArray.concat([
		NotHolidayAvg,
		WeekdayAvg,
		InOperatingHoursAvg,
		HolidayAvg,
		WeekendAvg,
		OutOperatingHoursAvg,
	]);
	const stringifiedArray = JSON.stringify(weatherArray);
	await fs.writeFileSync("python_ann/data.txt", stringifiedArray);
	exec(
		`py python_ann/predict.py ${building} ${room} ${reading}`,
		(err, stdout, stderr) => {
			if (err) console.error(err.stack);
			return res.status(200).json(JSON.parse(stdout));
			//console.log(stdout);
			//return res.status(200).json([]);
		}
	);
});

module.exports = router;
