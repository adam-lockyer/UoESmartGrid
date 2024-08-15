import React, { useEffect, useState } from "react";
import styles from "./detailed.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ResponsiveLine } from "@nivo/line";
import moment from "moment";
import Loading from "../Loading/Loading";

const Detailed = () => {
	let { date } = useParams();
	const newDate = moment(date.split(" ")[0]);
	const displayDate = newDate.format("dddd [the] Do [of] MMMM YYYY");
	const startDate = newDate.format("YYYY-MM-DD");
	const [iconName, setIconName] = useState("");
	const [graphData, setGraphData] = useState([]);
	const [data, setData] = useState([]);
	useEffect(async () => {
		delete axios.defaults.headers.common["x-auth-token"];
		const res = await axios.get(
			`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/50.73693657241516%2C%20-3.535222603443927/${startDate}?unitGroup=uk&key=X3SP63DXBLARJBRRF6PMBTYK6&include=obs%2Chours%2Ccurrent%2Chistfcst`
		);
		axios.defaults.headers.common["x-auth-token"] = localStorage["token"];
		setData(res.data);
		const hourlyData = res.data.days[0].hours;
		const icon = res.data.days[0].icon;
		setGraphData(hourlyData);
		if (icon === "rain") {
			setIconName("chancerain.svg");
		} else if (icon === "snow") {
			setIconName("chancesnow.svg");
		} else if (icon === "cloudy") {
			setIconName("cloudy.svg");
		} else if (icon === "partly-cloudy-day") {
			setIconName("partlycloudy.svg");
		} else if (icon === "partly-cloudy-night") {
			setIconName("nt_partlycloudy.svg");
		} else if (icon === "fog") {
			setIconName("fog.svg");
		} else if (icon === "wind") {
			setIconName("hazy.svg");
		} else if (icon === "clear-day") {
			setIconName("clear.svg");
		} else if (icon === "clear-night") {
			setIconName("nt_clear.svg");
		} else {
			setIconName("unknown.svg");
		}
	}, []);
	const tempData = graphData.map((e) => ({ x: e.datetime, y: e.temp }));
	const humidityData = graphData.map((e) => ({
		x: e.datetime,
		y: e.humidity,
	}));
	const windspeedData = graphData.map((e) => ({
		x: e.datetime,
		y: e.windspeed,
	}));
	const LineData1 = [
		{
			id: "",
			data: tempData,
		},
	];
	const LineData2 = [
		{
			id: "",
			data: humidityData,
		},
	];
	const LineData3 = [
		{
			id: "",
			data: windspeedData,
		},
	];
	return (
		<div className={styles.container}>
			{data?.days?.length > 0 ? (
				<div className={styles.Boxed}>
					<h3>Weather Data for {displayDate}</h3>
					<img src={"/black/svg/" + iconName} alt="" />
					<p>
						Average Temperature:{"  "}
						<b>
							{data.days[0].temp}
							&#8451;
						</b>
					</p>
					<p>
						Minimum:{"  "}
						<b>
							{data.days[0].tempmin}
							&#8451;
						</b>
					</p>
					<p>
						Maximum:{"  "}
						<b>
							{data.days[0].tempmax}
							&#8451;
						</b>
					</p>
					<p>
						Feels Like:{"  "}
						<b>
							{data.days[0].feelslike}
							&#8451;
						</b>
					</p>
					<br></br>
					<p>
						Average Wind Speed:
						<b> {data.days[0].windspeed} m/h</b>
					</p>
					<br></br>
					<p>
						Humidity: <b> {data.days[0].humidity}%</b>
					</p>
					<p>
						Precipitation:
						<b> {data.days[0].precip} mm</b>
					</p>
					<br></br>
					<p>
						Visibility:
						<b> {data.days[0].visibility} miles</b>
					</p>
					<p>
						Cloud Coverage:
						<b> {data.days[0].cloudcover}%</b>
					</p>

					<br></br>
					<div className={styles.Chart}>
						<h4>
							Temperature on the {newDate.format("Do [of] MMMM")}
						</h4>
						<MyResponsiveLine
							data={LineData1}
							units={<>&#8451;</>}
							leftLegend="Temperature (&#8451;)"
							chosenScheme="category10"
							min="-4"
						/>
						<br></br>
						<h4>
							Humidity on the {newDate.format("Do [of] MMMM")}
						</h4>
						<MyResponsiveLine
							data={LineData2}
							units="%"
							leftLegend="Humidity (%)"
							chosenScheme="set1"
							min="0"
						/>
						<br></br>
						<h4>
							Wind Speed on the {newDate.format("Do [of] MMMM")}
						</h4>
						<MyResponsiveLine
							data={LineData3}
							units="m/h"
							leftLegend="Wind Speed (miles per hour)"
							chosenScheme="spectral"
							min="0"
						/>
					</div>
				</div>
			) : (
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
					}}
				>
					<Loading />
				</div>
			)}
		</div>
	);
};
const MyResponsiveLine = ({ data, units, leftLegend, chosenScheme, min }) => {
	return (
		<ResponsiveLine
			data={data}
			margin={{ top: 20, right: 70, bottom: 70, left: 70 }}
			xScale={{
				type: "time",
				format: "%H:%M:%S",
			}}
			xFormat="time:%H:%M"
			yScale={{
				type: "linear",
				max: "auto",
				stacked: true,
				min: min,
			}}
			yFormat=" >-.2f"
			curve="monotoneX"
			axisTop={null}
			axisRight={null}
			axisBottom={{
				orient: "bottom",
				format: "%H:%M",
				tickValues: "every 2 hours",
				legend: "Time",
				tickRotation: -30,
				legendOffset: 50,
				legendPosition: "middle",
			}}
			axisLeft={{
				orient: "left",
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: leftLegend,
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
							x > 850 && styles.translatedOnRight
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
								<strong>Reading</strong>: {yFormatted} {units}
							</p>
						</div>
					</div>
				);
			}}
			colors={{ scheme: chosenScheme }}
			lineWidth={3}
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

export default Detailed;
