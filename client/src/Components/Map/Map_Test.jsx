import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Threebox } from 'threebox-plugin';
import { connect } from "react-redux";
import styles from "./MapTest.module.css";
import Loading from "../Loading/Loading";
import MyTooltip from '../MapToolTip/MapToolTip';

import 'mapbox-gl/dist/mapbox-gl.css';


const MapTest = () => {
	const mapContainerRef = useRef();
	const mapRef = useRef();
	const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || "";
	const [tooltipVisible, setTooltipVisible] = useState(false);
	const [selectedBuilding, setSelectedBuilding] = useState(null);


	const onCREWWselectedChange = () => {
		console.log("CREWW Building clicked");
		setTooltipVisible((prev) => !prev);
		setSelectedBuilding("CREWW");
	};

	useEffect(() => {

		mapboxgl.accessToken = mapboxToken;

		mapRef.current = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/light-v11',
			center: [-3.5345, 50.7367],
			zoom: 16.8,
			pitch: 64.9,
			bearing: 340,
			antialias: true
		});
  
		mapRef.current.on('style.load', () => {
			const layers = mapRef.current.getStyle().layers;
			const labelLayerId = layers.find(
			  (layer) => layer.type === 'symbol' && layer.layout['text-field']
			).id;

			mapRef.current.addLayer({
				id: 'custom-threebox-model',
				type: 'custom',
				renderingMode: '3d',
				onAdd: function () {
					window.tb = new Threebox(
					mapRef.current,
					mapRef.current.getCanvas().getContext('webgl'),
					{ 
						defaultLights: true ,
						enableSelectingFeatures: false,
						enableSelectingObjects: true,
						enableDraggingObjects: false,
						enableRotatingObjects: false,
						enableTooltips: false,
					}
					);
					const scale = 0.09;
					const options = {
					obj: './models/CREWW_Blocks.glb',
					type: 'gltf',
					scale: { x: scale, y: scale, z: scale },
					units: 'meters',
					rotation: { x: 0, y: 0, z: 0 }
					};
		
					window.tb.loadObj(options, (model) => {
						model.setCoords([-3.532868, 50.737040]);
						model.setRotation({ x: 0, y: 0, z: 207 });
						model.addEventListener('SelectedChange', onCREWWselectedChange, false);
						window.tb.add(model);
					});
					
				},
		
				render: function () {
					window.tb.update();
				}
			});
			// mapRef.current.addLayer(
			// 	{
			// 	  id: 'add-3d-buildings',
			// 	  source: 'composite',
			// 	  'source-layer': 'building',
			// 	  filter: ['==', 'extrude', 'true'],
			// 	  type: 'fill-extrusion',
			// 	  minzoom: 15,
			// 	  paint: {
			// 		'fill-extrusion-color': '#aaa',
			// 		'fill-extrusion-height': [
			// 		  'interpolate',
			// 		  ['linear'],
			// 		  ['zoom'],
			// 		  15,
			// 		  0,
			// 		  15.05,
			// 		  ['get', 'height']
			// 		],
			// 		'fill-extrusion-base': [
			// 		  'interpolate',
			// 		  ['linear'],
			// 		  ['zoom'],
			// 		  15,
			// 		  0,
			// 		  15.05,
			// 		  ['get', 'min_height']
			// 		],
			// 		'fill-extrusion-opacity': 0.6
			// 	  }
			// 	},
			// 	labelLayerId
			// );
		});
	    return () => mapRef.current.remove();
	}, []);
  
	return (
			<div className={styles.mapContainter}>
				<div id="map" ref={mapContainerRef} className={styles.map}></div>
				{tooltipVisible && (
					<MyTooltip selectedBuilding={selectedBuilding}/>
				)}
			</div>
	)

};

export default connect(null, {})(MapTest);
