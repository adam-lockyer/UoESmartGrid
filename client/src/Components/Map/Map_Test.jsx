import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Threebox } from "threebox-plugin";
import { connect } from "react-redux";
import styles from "./MapTest.module.css";
import Loading from "../Loading/Loading";
import MyTooltip from "../MapToolTip/MapToolTip";

import "mapbox-gl/dist/mapbox-gl.css";

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

		new mapboxgl.Popup({ offset: 0 }).setLngLat([-3.532868, 50.73708, 78.2]).setHTML(`<h1>Hello</h1>`).addTo(mapRef.current);
    };

    useEffect(() => {
        mapboxgl.accessToken = mapboxToken;

        mapRef.current = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/light-v11",
            center: [-3.5345, 50.7367],
            zoom: 16.8,
            pitch: 64.9,
            bearing: 340,
            antialias: true,
        });

        mapRef.current.on("style.load", () => {
            const layers = mapRef.current.getStyle().layers;
            const labelLayerId = layers.find(
                (layer) => layer.type === "symbol" && layer.layout["text-field"],
            ).id;

            mapRef.current.addLayer({
                id: "custom-threebox-model",
                type: "custom",
                renderingMode: "3d",
                minzoom: 2,
                maxzoom: 24,
                onAdd: function () {
                    window.tb = new Threebox(
                        mapRef.current,
                        mapRef.current.getCanvas().getContext("webgl"),
                        {
							realSunlight: true,
							enableTooltips: true,
                            defaultLights: true,
                            enableSelectingFeatures: true,
                            enableSelectingObjects: true,
                            enableDraggingObjects: false,
                            enableRotatingObjects: false,
                        },
                    );
                    const scale = 0.11;
                    const options = {
                        obj: "./models/CREWW_Blocks.glb",
                        type: "gltf",
                        scale: { x: scale, y: scale, z: scale },
                        units: "meters",
                        rotation: { x: 0, y: 0, z: 0 },
						enableTooltips: true,
                    };

                    window.tb.loadObj(options, (model) => {
                        model.setCoords([-3.532868, 50.73708, 78.2]);
                        model.setRotation({ x: 0, y: 0, z: 207 });
                        model.anchor = "bottom";
                        model.addEventListener("SelectedChange", onCREWWselectedChange, false);
						model.addTooltip("hello", true);
                        window.tb.add(model);
                    });
                },

                render: function () {
                    window.tb.update();
                },
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
            mapRef.current.addSource("mapbox-dem", {
                type: "raster-dem",
                url: "mapbox://mapbox.mapbox-terrain-dem-v1",
                tileSize: 512,
                maxzoom: 14,
            });
			mapRef.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1 });
        });
        return () => mapRef.current.remove();
    }, []);

    return (
        <div className={styles.mapContainter}>
            <div id="map" ref={mapContainerRef} className={styles.map}></div>
            {/* {tooltipVisible && (
					<MyTooltip selectedBuilding={selectedBuilding}/>
				)} */}
        </div>
    );
};

export default connect(null, {})(MapTest);
