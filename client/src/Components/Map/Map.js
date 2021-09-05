import React, { useState } from "react";
import ReactMapGL, { Popup, Marker, LinearInterpolator } from "react-map-gl";
import mapStyle from "./mapStyle.json";
import { useHistory } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { connect } from "react-redux";

import styles from "./Map.module.css";

const Map = () => {
	const MAPBOX_TOKEN =
		"pk.eyJ1Ijoic3F1aWdnbGVzMjU2IiwiYSI6ImNranVqeXY0MTAza3kydW51NGpvdG55MTEifQ.0kZloHbRuIykDGTOzHd1eQ";
	const [viewport, setViewport] = useState({
		latitude: 50.7367,
		longitude: -3.5345,
		zoom: isMobile ? 15.2 : 15.6,
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
			latitude: 50.737782,
			longitude: -3.532731662628254,
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
			latitude: 50.73821267292098,
			longitude: -3.53079964330287,
			name: "The Innovation Centre (Phase 1)",
			tag: "Innovation",
			description:
				"The Student Guild Building For The University Of Exeter",
		},
		{
			latitude: 50.73577533849034,
			longitude: -3.5310727126481147,
			name: "The Buisness School",
			tag: "Buisness School",
			description: "Mathematics, Physics & Engineering Building",
		},
		{
			latitude: 50.738718936006165,
			longitude: -3.5339244143256545,
			name: "The ESS Hub (Location / Name Wrong)",
			tag: "ESS Hub",
			description:
				"The Student Guild Building For The University Of Exeter",
		},
		{
			latitude: 50.73338355937932,
			longitude: -3.534236245798638,
			name: "The Old Library",
			tag: "Old Library",
			description:
				"The Student Guild Building For The University Of Exeter",
		},
		{
			latitude: 50.73610987218851,
			longitude: -3.5364778772737404,
			name: "Stocker Road (Location Unknown)",
			tag: "Stocker Road",
			description: "Mathematics, Physics & Engineering Building",
		},
		{
			latitude: 50.73601184260492,
			longitude: -3.5302052639746182,
			name: "XFI Building",
			tag: "XFI Building",
			description:
				"The Student Guild Building For The University Of Exeter",
		},
		{
			latitude: 50.73734030312634,
			longitude: -3.537269768610702,
			name: "Russel Seal Fitness Centre",
			tag: "Russel Seal Fitness Centre",
			description:
				"The Student Guild Building For The University Of Exeter",
		},
		{
			latitude: 50.73587727213909,
			longitude: -3.5381436735797305,
			name: "Reed Hall",
			tag: "Reed Hall",
			description: "Mathematics, Physics & Engineering Building",
		},
		{
			latitude: 50.73738647901267,
			longitude: -3.5345376047722477,
			name: "The Experimental Garden (Location Unknown)",
			tag: "Experimental Garden",
			description:
				"The Student Guild Building For The University Of Exeter",
		},
		{
			latitude: 50.73688276823508,
			longitude: -3.5380840101232738,
			name: "The Family Centre",
			tag: "Family Centre",
			description:
				"The Student Guild Building For The University Of Exeter",
		},
		{
			latitude: 50.73743570664965,
			longitude: -3.5336499776094146,
			name: "The Laver Building",
			tag: "Laver Building",
			description:
				"The Student Guild Building For The University Of Exeter",
		},
		{
			latitude: 50.73557191252847,
			longitude: -3.5334016081721875,
			name: "The Forum Library",
			tag: "Library",
			description: "Mathematics, Physics & Engineering Building",
		},
		{
			latitude: 50.73894376612415,
			longitude: -3.54453904407205,
			name: "Moberly",
			tag: "Moberly",
			description:
				"The Student Guild Building For The University Of Exeter",
		},
		{
			latitude: 50.73706383150563,
			longitude: -3.53489507661756,
			name: "The Living Systems Institute",
			tag: "Living Systems Institute",
			description:
				"The Student Guild Building For The University Of Exeter",
		},
		{
			latitude: 50.73647062297446,
			longitude: -3.531939766534703,
			name: "The Amory Building",
			tag: "Amory Building",
			description:
				"The Student Guild Building For The University Of Exeter",
		},
		{
			latitude: 50.73758488506106,
			longitude: -3.5377027676861164,
			name: "Indoor Cricket Centre",
			tag: "Cricket Centre",
			description:
				"The Student Guild Building For The University Of Exeter",
		},
		{
			latitude: 50.73722471909444,
			longitude: -3.5362740133747563,
			name: "The Physics Building",
			tag: "Physics Building",
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
									{/* <img
										onClick={() => clicked(location)}
										className={styles.marker}
										src={poiMarker}
										alt=""
									/> */}
									<div
										className={styles.poi}
										onClick={() => clicked(location)}
									></div>
								</Marker>
								{selectedLocation.name === location.name && (
									<Popup
										className={styles.popup}
										latitude={location.latitude - 0.00009}
										longitude={
											location.longitude + 0.000115
										}
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
