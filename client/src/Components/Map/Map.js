import React, { useState } from "react";
import ReactMapGL, { Popup, Marker, LinearInterpolator } from "react-map-gl";
import mapStyle from "./mapStyle.json";
import { useHistory } from "react-router-dom";
import { isMobile } from "react-device-detect";
import poiMarker from "./imgMarker.png";
import { connect } from "react-redux";

import styles from "./Map.module.css";

const Map = () => {
	const MAPBOX_TOKEN =
		"pk.eyJ1Ijoic3F1aWdnbGVzMjU2IiwiYSI6ImNranVqeXY0MTAza3kydW51NGpvdG55MTEifQ.0kZloHbRuIykDGTOzHd1eQ";
	const [viewport, setViewport] = useState({
		latitude: 50.7367,
		longitude: -3.5345,
		zoom: isMobile ? 15.2 : 16,
		bearing: 0,
		pitch: 0,
		transitionDuration: 1000,
		transitionInterpolator: new LinearInterpolator(),
	});
	const history = useHistory();
	const [selectedLocation, setSelectedLocation] = useState({});

	const originalLat = 50.7367;
	const originalLong = -3.5345;

	const locations = [
		{
			latitude: 50.737742,
			longitude: -3.5325351662628254,
			name: "The Harrison Building",
			tag: "Harrison",
			description: "Mathematics, Physics & Engineering Building",
		},
		{
			latitude: 50.735342771639566,
			longitude: -3.5338534585742294,
			name: "The Forum",
			tag: "Forum",
			description:
				"The Student Guild Building For The University Of Exeter",
		},
		{
			latitude: 50.73817859464701,
			longitude: -3.530627644003169,
			name: "The Innovation Centre",
			tag: "Innovation",
			description:
				"The Student Guild Building For The University Of Exeter",
		},
	];

	const clicked = (location) => {
		setViewport({
			...viewport,
			latitude: location.latitude - 0.0008,
			longitude: location.longitude,
			transitionDuration: 500,
			transitionInterpolator: new LinearInterpolator(),
		});
		setSelectedLocation(location);
	};

	return (
		<>
			<div className={styles.map}>
				<ReactMapGL
					{...viewport}
					width="100%"
					height="calc(100vh - 66px)"
					mapStyle={mapStyle}
					onViewportChange={(nextViewport) =>
						setViewport(nextViewport)
					}
					mapboxApiAccessToken={MAPBOX_TOKEN}
					dragPan={false}
					scrollZoom={false}
					touchZoom={false}
					doubleClickZoom={false}
					getCursor={(e) => "default"}
				>
					<>
						{locations.map((location, index) => (
							<div key={index}>
								<Marker
									latitude={location.latitude}
									longitude={location.longitude}
								>
									<img
										onClick={() => clicked(location)}
										className={styles.marker}
										src={poiMarker}
										alt=""
									/>
								</Marker>
								{selectedLocation.name === location.name && (
									<Popup
										className={styles.popup}
										latitude={location.latitude}
										longitude={location.longitude}
										closeButton={true}
										closeOnClick={false}
										anchor="top"
										onClose={() => {
											setViewport({
												...viewport,
												latitude: originalLat,
												longitude: originalLong,
											});
											setSelectedLocation({});
										}}
									>
										<div className={styles.popupContent}>
											<h2>{location.name}</h2>
											<p>{location.description}</p>
											<br />
											<div
												className={styles.buttonSpacer}
											>
												<button
													onClick={() =>
														history.push(
															`/${location.tag}/Consumption`
														)
													}
												>
													View Consumptions
												</button>
												<button
													onClick={() =>
														history.push(
															`/forecast/${location.tag}/`
														)
													}
												>
													View Consumption Forecast
												</button>
											</div>
										</div>
									</Popup>
								)}
							</div>
						))}
					</>
				</ReactMapGL>
			</div>
		</>
	);
};

export default connect(null, {})(Map);
