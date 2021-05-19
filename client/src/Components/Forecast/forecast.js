import React, { useEffect, useState } from "react";
import styles from "./forecast.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ResponsiveLine } from "@nivo/line";
import moment from "moment";
import Loading from "../Loading/Loading";

const Forecast = () => {
	let { building } = useParams();
	const [rooms, setRooms] = useState([]);
	const [loading, setLoading] = useState(false);
	const [predictions, setPredictions] = useState([]);
	const [selectedRoom, setSelectedRoom] = useState("");
	const [selectedReading, setSelectedReading] = useState(null);
	const [cleanData, setCleanData] = useState({
		sum: 0,
		mean: 0,
		weekdaysum: 0,
		weekdaymean: 0,
		operatingsum: 0,
		operatingmean: 0,
		weekendsum: 0,
		weekendmean: 0,
		notoperatingsum: 0,
		notoperatingmean: 0,
		max_value: [0, 0, 0, 0, 0, 0, 0],
		min_value: [0, 0, 0, 0, 0, 0, 0],
	});
	const [readings, setReadings] = useState(null);
	const [units, setUnits] = useState("");
	const [showModal, setShowModal] = useState(false);

	useEffect(async () => {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/api/rooms/${building}`
		);
		setRooms(res.data.room);
	}, []);

	useEffect(async () => {
		setPredictions([]);
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/api/rooms/reading?Room=${selectedRoom}`
		);
		setReadings(res.data.readings);
	}, [selectedRoom]);

	useEffect(async () => {
		if (selectedReading === null) return;
		setLoading(true);
		setPredictions([]);
		const data = await getData();
		if (data) {
			setPredictions(data);
		}
		setLoading(false);
	}, [selectedReading]);

	const getData = async () => {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};
		const body = JSON.stringify({
			room: encodeURI(selectedRoom),
			building: building,
			reading: selectedReading,
		});
		const res = await axios.post(
			`${process.env.REACT_APP_API_URL}/api/forecast`,
			body,
			config
		);
		return res.data;
	};

	const LineData = [
		{
			id: "",
			data: predictions.map((pred) => {
				return {
					x: pred[10],
					y: pred[9],
				};
			}),
		},
	];

	const handleClick = (e) => {
		setShowModal(!showModal);
	};
	let sum,
		mean,
		weekdaysum,
		weekdaymean,
		operatingsum,
		operatingmean,
		weekendsum,
		weekendmean,
		notoperatingsum,
		notoperatingmean,
		max_value,
		min_value;

	if (predictions.length > 1) {
		const predictionsCopy = [...predictions];
		const values = predictionsCopy.map((item) => item[9]);
		sum = values.reduce((acc, current) => acc + current);
		mean = sum / values.length;
		const weekdayvalues = predictionsCopy
			.map((item) => item[6] === 1 && item[9])
			.filter((value) => value !== false);
		const operatingvalues = predictionsCopy
			.map((item) => item[7] === 1 && item[9])
			.filter((value) => value !== false);
		weekdaysum = weekdayvalues.reduce((acc, current) => acc + current);
		weekdaymean = weekdaysum / weekdayvalues.length;
		operatingsum = operatingvalues.reduce((acc, current) => acc + current);
		operatingmean = operatingsum / operatingvalues.length;
		const weekendvalues = predictionsCopy
			.map((item) => item[6] === 0 && item[9])
			.filter((value) => value !== false);

		const notoperatingvalues = predictionsCopy
			.map((item) => item[7] === 0 && item[9])
			.filter((value) => value !== false);
		weekendsum = weekendvalues.reduce((acc, current) => acc + current);
		weekendmean = weekendsum / weekendvalues.length;
		notoperatingsum = notoperatingvalues.reduce(
			(acc, current) => acc + current
		);
		notoperatingmean = notoperatingsum / notoperatingvalues.length;

		const sortedValues = predictionsCopy.sort((a, b) => a[9] - b[9]);
		max_value = sortedValues[sortedValues.length - 1];
		min_value = sortedValues[0];
	}

	return (
		<div className={styles.container}>
			<div className={styles.left}>
				<div className={styles.title}>
					<h3>Consumption Forecast</h3>
				</div>

				<div className={styles.Prompt}>
					{!selectedRoom ? (
						<h5>Select a Room</h5>
					) : (
						!selectedReading && <h5>Select a Measurement</h5>
					)}
				</div>
				<div className={styles.roomNames}>
					{rooms.map((room, index) => (
						<button
							key={index}
							onClick={() => setSelectedRoom(room.value)}
							className={
								selectedRoom === room.value
									? styles.roomActive
									: ""
							}
						>
							{room.value}
						</button>
					))}
				</div>
			</div>
			<div className={styles.right}>
				<div className={styles.readingTabs}>
					{readings &&
						readings.map((reading, index) => (
							<button
								key={index}
								onClick={() => {
									setSelectedReading(reading.name);
									reading.name === "Electric"
										? setUnits("kWh")
										: reading.name === "Water"
										? setUnits("m3")
										: reading.name === "Gas" &&
										  setUnits("ft3");
									// Call network and predict value
								}}
								className={
									selectedReading === reading.name
										? styles.tabActive
										: ""
								}
							>
								{reading.name}
							</button>
						))}
				</div>
				<div className={styles.graphTitle}>
					{predictions.length > 0 && (
						<>
							<h3>Usage in the next 14 days</h3>
						</>
					)}
				</div>
				{predictions.length > 0 && (
					<div className={styles.observations}>
						<>
							<p>
								Total Usage:{" "}
								<b>
									{Math.round(sum * 100) / 100} {units}
								</b>
							</p>
							<p>
								Average Usage:{" "}
								<b>
									{Math.round(mean * 100) / 100} {units}
								</b>
							</p>
							<br />
							<p>
								Highest Usage:{" "}
								<b>
									{Math.round(max_value[9] * 100) / 100}{" "}
									{units}
								</b>{" "}
								on{" "}
								{moment(max_value[6]).format(
									"dddd Do [at] HH:mm"
								)}
							</p>
							<p>
								Lowest Usage:{" "}
								<b>
									{Math.round(min_value[9] * 100) / 100}{" "}
									{units}
								</b>{" "}
								on{" "}
								{moment(min_value[6]).format(
									"dddd Do [at] HH:mm"
								)}
							</p>
							<br />
							<p>
								Total Weekday Usage:
								<b>
									{" "}
									{Math.round(weekdaysum * 100) / 100} {units}
								</b>
							</p>
							<p>
								Average Weekday Usage:
								<b>
									{" "}
									{Math.round(weekdaymean * 100) / 100}{" "}
									{units}
								</b>
							</p>
							<br />
							<p>
								Total Weekend Usage:
								<b>
									{" "}
									{Math.round(weekendsum * 100) / 100} {units}
								</b>
							</p>
							<p>
								Average Weekend Usage:
								<b>
									{" "}
									{Math.round(weekendmean * 100) / 100}{" "}
									{units}
								</b>
							</p>
							<br />
							<p>
								Total Usage In Operating Hours:{" "}
								<b>
									{Math.round(operatingsum * 100) / 100}{" "}
									{units}
								</b>
							</p>
							<p>
								Average Usage In Operating Hours:
								<b>
									{" "}
									{Math.round(operatingmean * 100) / 100}{" "}
									{units}
								</b>
							</p>
							<br />
							<p>
								Total Usage Outside Operating Hours:
								<b>
									{" "}
									{Math.round(notoperatingsum * 100) /
										100}{" "}
									{units}
								</b>
							</p>
							<p>
								Average Usage Outside Operating Hours:
								<b>
									{" "}
									{Math.round(notoperatingmean * 100) /
										100}{" "}
									{units}
								</b>
							</p>
						</>
					</div>
				)}
				<div className={styles.GraphStyling}>
					{!loading && predictions.length > 0 ? (
						<>
							<MyResponsiveLine
								data={LineData}
								units={units}
								handleClick={handleClick}
								chosenScheme="set1"
							/>
						</>
					) : loading ? (
						<Loading />
					) : (
						<p>No Data Available</p>
					)}
				</div>
			</div>
		</div>
	);
};

const MyResponsiveLine = ({ data, units, handleClick, chosenScheme }) => {
	return (
		<ResponsiveLine
			onClick={(e) => handleClick(e)}
			data={data}
			margin={{ top: 80, right: 50, bottom: 70, left: 50 }}
			xScale={{
				type: "time",
				format: "%Y-%m-%d %H:%M",
			}}
			xFormat="time:%Y-%m-%d %H:%M"
			yScale={{
				type: "linear",
				max: "auto",
				stacked: true,
				min: 0,
			}}
			yFormat=" >-.2f"
			curve="monotoneX"
			axisTop={null}
			axisRight={null}
			axisBottom={{
				orient: "bottom",
				format: "%b %d, %H:%M",
				tickValues: 10,
				legend: "Time",
				tickRotation: -30,
				legendOffset: 60,
				legendPosition: "middle",
			}}
			axisLeft={{
				orient: "left",
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: "Reading Value",
				legendOffset: -40,
				legendPosition: "middle",
			}}
			tooltip={({
				point: {
					x,
					serieColor,
					data: { xFormatted, yFormatted },
				},
			}) => {
				return (
					<div
						className={`${styles.tooltip} ${
							x > 700 && styles.translatedOnRight
						} ${x < 70 && styles.translatedOnLeft}`}
					>
						<div
							className={styles.square}
							style={{
								background: serieColor,
								width: "20px",
								height: "20px",
							}}
						></div>
						<div className={styles.paragraphs}>
							<p>
								<strong>Time</strong>: {xFormatted}{" "}
							</p>
							<br />
							<p>
								<strong>Reading</strong>: {yFormatted}{" "}
								{units === "m3" ? (
									<span>
										m<sup>3</sup>
									</span>
								) : units === "ft3" ? (
									<span>
										m<sup>3</sup>
									</span>
								) : (
									<span>{units}</span>
								)}
							</p>
						</div>
					</div>
				);
			}}
			colors={{ scheme: chosenScheme }}
			pointSize={5}
			pointColor={{ theme: "background" }}
			pointBorderWidth={2}
			pointBorderColor={{ from: "serieColor" }}
			pointLabelYOffset={-12}
			pointLabelXOffset={-12}
			enableArea={true}
			useMesh={true}
			areaOpacity={0.3}
		/>
	);
};

export default Forecast;
