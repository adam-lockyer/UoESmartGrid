import React, { useState, useRef } from "react";
import ReactMapGL, { Popup, Marker } from "react-map-gl";
import { Threebox } from 'threebox-plugin';
import "mapbox-gl/dist/mapbox-gl.css";
import mapStyle from "./mapStyle.json";
import { isMobile } from "react-device-detect";
import { connect } from "react-redux";
import PlaceIcon from '@mui/icons-material/Place';

import styles from "./Map.module.css";
import { useNavigate } from "react-router-dom";

const Map = () => {
	const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";
	const [viewport, setViewport] = useState({
		latitude: 50.7367,
		longitude: -3.5345,
		zoom: isMobile ? 15.2 : 15.6,
		bearing: 0,
		pitch: 0,
		transitionDuration: 1000,
	});
	const [selectedLocation, setSelectedLocation] = useState({});

	const navigate = useNavigate();

	const originalLat = 50.7367;
	const originalLong = -3.5345;



	const locations = [
		{
			latitude: 50.736942,
			longitude: -3.532983,
			name: "The CREWW Building",
			tag: "CREWW",
			description: "Sustainability Building",
		},
	];

	const clicked = (location) => {
		setViewport({
			...viewport,
			latitude: location.latitude - 0.0008,
			longitude: location.longitude,
			transitionDuration: 500,
		});
		setSelectedLocation(location);
	};

	return (
		<>
			<div className={styles.map}>
				<ReactMapGL
					{...viewport}
					mapStyle={mapStyle}
					onViewportChange={(nextViewport) =>
						setViewport(nextViewport)
					}
					style={{width: '100vw', height: 'calc(100vh - 68px)'}}
					mapboxAccessToken={MAPBOX_TOKEN}
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
										src={PlaceIcon}
										alt=""
									/>
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
														navigate(
															`/${location.tag}/Dashboard`
														)
													}
												>
													Open Building Dashboard
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
