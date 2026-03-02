import React, { useCallback, useState } from "react";
import MyTooltip from "../MapToolTip/MapToolTip";

import "mapbox-gl/dist/mapbox-gl.css";
import { Map3D } from "./Map3D/Map3D";
import { Box } from "@mui/material";

import { Map } from "@vis.gl/react-google-maps";
import { APIProvider } from "./api-provider";

const INITIAL_VIEW_PROPS = {
  center: {lat:  50.736942, lng: -3.532983, altitude: 1300},
  range: 5000,
  heading: 61,
  tilt: 69,
  roll: 0
};

const MapTestGoogle = () => {
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const onCREWWselectedChange = () => {
        console.log("CREWW Building clicked");
        setTooltipVisible((prev) => !prev);
        setSelectedBuilding("CREWW");
    };

    const [cameraProps, setCameraProps] = useState(INITIAL_VIEW_PROPS);

    const handleCameraChange = useCallback(props => setCameraProps(props), []);
    return (
        <Box width="100vw" height="100vh">
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['maps3d']}>
                <Map3D
                    {...cameraProps}
                    onCameraChanged={handleCameraChange}
                    defaultLabelsDisabled
                    mode="SATELLITE"
                />
            </APIProvider>
            {/* {tooltipVisible && (
                    <MyTooltip selectedBuilding={selectedBuilding}/>
                )} */}
        </Box>
    );
};

export default MapTestGoogle;
