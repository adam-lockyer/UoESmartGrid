import React, { useEffect, useState } from "react";
import styles from "./Consumption.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ResponsiveLine } from "@nivo/line";
import { useHistory } from "react-router-dom";
import moment from "moment";

const Consumption = () => {
	let { building } = useParams();
	//const currentDate = Date.now()
	const currentDate = moment().unix() * 1000;
	const oneDayEpoch = 86400000;
	const timeIntervals = [
		{
			start: currentDate,
			end: currentDate - oneDayEpoch,
			letter: "1d",
			value: "Past Day",
			grouping: "Hourly Data",
		},
		{
			start: currentDate,
			end: currentDate - oneDayEpoch * 7,
			letter: "7d",
			value: "Past Week",
			grouping: "Averaged  over 2 hours",
		},
		{
			start: currentDate,
			end: currentDate - oneDayEpoch * 30,
			letter: "30d",
			value: "Past Month",
			grouping: "Averaged over 12 hours",
		},
		{
			start: currentDate,
			end: currentDate - oneDayEpoch * 365,
			letter: "365d",
			value: "Past Year",
			grouping: "Averaged over 1 day",
		},
		{
			start: currentDate,
			end: currentDate - oneDayEpoch * 3650,
			letter: "3650d",
			value: "All Time",
			grouping: "Averaged over 2 Weeks",
		},
		{
			value: "Custom Date",
		},
	];

	const [interval, setInterval] = useState(timeIntervals[0]);
	const [dateRange, setDateRange] = useState({
		startDate: new Date().getTime(),
		endDate: new Date().getTime(),
	});
	const [Room, setRoom] = useState("");
	const [readings, setReadings] = useState(null);
	const [selectedReading, setSelectedReading] = useState(null);
	const [rooms, setRooms] = useState([]);
	const [Consump, setConsump] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [units, setUnits] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [selectedData, setSelectedData] = useState(false);
	const [currentGrouping, setCurrentGrouping] = useState("");
	const history = useHistory();

	useEffect(async () => {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/api/rooms/${building}`
		);
		setRooms(res.data.room);
	}, []);

	useEffect(async () => {
		const res = await axios.get(
			`${process.env.REACT_APP_API_URL}/api/rooms/reading?Room=${Room}`
		);
		setSelectedReading(null);
		setReadings(res.data.readings);
		setInterval(timeIntervals[0]);
	}, [Room]);

	useEffect(async () => {
		getData();
	}, [readings, interval, selectedReading]);

	const getData = async () => {
		setConsump([]);
		if (interval && Room && selectedReading) {
			const res = await axios.get(
				`${
					process.env.REACT_APP_API_URL
				}/api/consumption/${building}?StartDate=${
					interval.value === "Custom Date"
						? dateRange.endDate
						: interval.start
				}&EndDate=${
					interval.value === "Custom Date"
						? dateRange.startDate
						: interval.end
				}&room=${Room}&reading=${selectedReading}`
			);
			setConsump(res.data.consumption);
			setCurrentGrouping(res.data.grouping);
		}
	};

	const LineData = [
		{
			id: "",
			data: Consump.map((cons) => {
				const timeEpoch = Date.parse(cons.time);
				const outDate = new Date(timeEpoch).toISOString().substr(0, 10);
				const outTime = new Date(timeEpoch).toISOString().substr(11, 5);
				let XAxis = `${outDate} ${outTime}`;
				return {
					x: XAxis,
					y: cons.reading,
				};
			}),
		},
	];

	const handleDate = (e, startOrEnd) => {
		if (e.target.value) {
			if (startOrEnd === "end") {
				setDateRange({
					...dateRange,
					endDate: Date.parse(e.target.value),
				});
			} else {
				setDateRange({
					...dateRange,
					startDate: Date.parse(e.target.value),
				});
			}
		}
	};

	const handleIntervalClick = (timeInterval) => {
		if (timeInterval.value === "Custom Date") {
			setModalOpen(true);
			setInterval(timeInterval);
		} else {
			setInterval(timeInterval);
		}
	};

	const handleClick = (e) => {
		const data = LineData[0].data[e.index];
		setSelectedData(data);
		setShowModal(!showModal);
	};
	return (
		<>
			{(modalOpen || showModal) && (
				<div
					onClick={() => {
						setShowModal(false);
						setModalOpen(false);
					}}
					className={styles.darken}
				></div>
			)}
			<div className={styles.container}>
				{modalOpen && (
					<>
						<div
							className={`${styles.modal} ${styles.customDateModal}`}
						>
							<img
								src={"/close.png"}
								onClick={() => setModalOpen(false)}
								alt=""
							/>
							<div className={styles.dpContainer}>
								<h3>Pick Starting and Ending Dates</h3>
								<div className={styles.datePickerContainer}>
									<p>From</p>
									<input
										className={styles.datepicker}
										type="date"
										id="start"
										name="interval-start"
										value={
											new Date(dateRange.startDate)
												.toISOString()
												.split("T")[0]
										}
										onChange={(e) => handleDate(e, "start")}
									/>
								</div>
								<div className={styles.datePickerContainer}>
									<p>Until</p>
									<input
										className={styles.datepicker}
										type="date"
										id="end"
										name="interval-end"
										value={
											new Date(dateRange.endDate)
												.toISOString()
												.split("T")[0]
										}
										onChange={(e) => handleDate(e, "end")}
									/>
								</div>
							</div>
							<button
								onClick={() => {
									setModalOpen(false);
									getData();
								}}
							>
								Submit
							</button>
						</div>
					</>
				)}
				{showModal && (
					<div className={styles.customDateModal}>
						<img
							src={"/close.png"}
							onClick={() => setShowModal(false)}
							alt=""
						/>
						<div className={styles.dpContainer}>
							<h3>Selected Data</h3>
							<div className={styles.dataContainer}>
								<p>
									Time -{" "}
									<span>
										{moment(selectedData.x).format(
											"dddd, MMMM Do YYYY, h:mm:ss"
										)}
									</span>
								</p>
								<p>
									Reading -{" "}
									<span>
										{Math.round(selectedData.y * 100) / 100}{" "}
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
									</span>
								</p>
							</div>
							{currentGrouping === "1h" ? (
								<button
									className={styles.detailsButton}
									onClick={() =>
										history.push(
											`/room/${Room}/${selectedData.x}`
										)
									}
								>
									Check Info at This Time
								</button>
							) : (
								<button
									className={styles.detailsButton}
									onClick={() => {
										let timeType = "";

										if (
											currentGrouping.match(
												/[a-z]+|[^a-z]+/gi
											)[1] === "d"
										) {
											timeType = "days";
										} else {
											timeType = "hours";
										}
										const originalDate1 = moment(
											selectedData.x
										);
										const originalDate2 = moment(
											selectedData.x
										);
										const adjustedStart = originalDate1
											.subtract(
												currentGrouping.match(
													/[a-z]+|[^a-z]+/gi
												)[0],
												timeType
											)
											.valueOf();
										let adjustedEnd = originalDate2.add(
											currentGrouping.match(
												/[a-z]+|[^a-z]+/gi
											)[0],
											timeType
										);
										if ((timeType = "h")) {
											adjustedEnd = adjustedEnd
												.add(
													currentGrouping.match(
														/[a-z]+|[^a-z]+/gi
													)[0],
													timeType
												)
												.valueOf();
										}

										setDateRange({
											startDate: adjustedStart,
											endDate: adjustedEnd,
										});
										setShowModal(false);
										setInterval(timeIntervals[5]);
										getData();
									}}
								>
									View Details
								</button>
							)}
						</div>
					</div>
				)}
				<div className={styles.BuildingImg}>
					<div className={styles.Prompt}>
						{!Room ? (
							<h5>Select a Room</h5>
						) : (
							!selectedReading && <h5>Select a Measurement</h5>
						)}
					</div>
					<div className={styles.roomNames}>
						{rooms.map((room) => (
							<div
								onClick={() => setRoom(room.value)}
								style={{
									borderRight:
										Room === room.value
											? "10px solid rgba(0, 124, 226, 0.8)"
											: "10px solid transparent",
								}}
							>
								{room.value}
							</div>
						))}
					</div>
				</div>
				<div className={styles.Graph}>
					<div className={styles.Boxed}>
						<div className={styles.Tabs}>
							<div className={styles.readingTabs}>
								{readings &&
									readings.map((reading) => (
										<>
											<button
												onClick={() => {
													setSelectedReading(
														reading.name
													);
													reading.name === "Electric"
														? setUnits("kWh")
														: reading.name ===
														  "Water"
														? setUnits("m3")
														: reading.name ===
																"Gas" &&
														  setUnits("m3");
													getData();
												}}
												className={
													selectedReading ===
													reading.name
														? styles.active
														: ""
												}
											>
												{reading.name}
											</button>
										</>
									))}
							</div>
							<div className={styles.intervalTabs}>
								{timeIntervals.map((timeInterval) => (
									<button
										onClick={() => {
											handleIntervalClick(timeInterval);
										}}
										className={
											timeInterval.letter ===
											interval.letter
												? styles.active
												: ""
										}
									>
										{timeInterval.value}
									</button>
								))}
							</div>
						</div>
						<div className={styles.GraphStyling}>
							{Consump.length > 0 ? (
								<>
									<MyResponsiveLine
										data={LineData}
										units={units}
										handleClick={handleClick}
									/>
								</>
							) : (
								<h4 className={styles.noData}>
									No Data Available
								</h4>
							)}
						</div>
						<div className={styles.groupingPrompt}>
							{Consump.length > 0 && currentGrouping && (
								<>
									<p>
										Data is grouped over{" "}
										{
											currentGrouping.match(
												/[a-z]+|[^a-z]+/gi
											)[0]
										}{" "}
										{currentGrouping.match(
											/[a-z]+|[^a-z]+/gi
										)[1] === "d"
											? "day(s)"
											: "hour(s)"}
									</p>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
const MyResponsiveLine = ({ data, units, handleClick }) => {
	return (
		<ResponsiveLine
			onClick={(e) => handleClick(e)}
			data={data}
			margin={{ top: 100, right: 70, bottom: 70, left: 70 }}
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
										ft<sup>3</sup>
									</span>
								) : (
									<span>{units}</span>
								)}
							</p>
						</div>
					</div>
				);
			}}
			colors={{ scheme: "category10" }}
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

export default Consumption;
