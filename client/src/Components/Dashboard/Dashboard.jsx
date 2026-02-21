import { Box, Button } from "@mui/material";
import React, { useRef, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { nivoData } from "./mockData";


import Icon from "../Icon/Icon";
import QuickViewBox from "./GridBoxes/QuickViewBox";
import QuickViewComparison from "./GridBoxes/QuickViewComparison";
import GraphBox from "./GridBoxes/GraphBox";

const sharedBoxStyle = { display: "flex", alignItems: "center", columnGap: 0.5, rowGap: 0 };
 const buttonStyles={ fontSize: '0.875rem', padding:'0', marginRight:'10px', marginLeft:'10px', color:'#ffffff' }

const Dashboard = () => {
    const { building } = useParams();
    const navigate = useNavigate();
    const OccupiedRooms = 14
    const OccupancySensedRooms = 43
    const tickString = "every 5 minutes";

    const consumpLineData = [
		{
			id: "EnergyComsuption",
            color: "hsl(271, 70%, 50%)",
			data: nivoData?.map((cons) => {
				const timeEpoch = Date.parse(cons.datetime);
				const outDate = new Date(timeEpoch).toISOString().substr(0, 10);
				const outTime = new Date(timeEpoch).toISOString().substr(11, 5);
				let XAxis = `${outDate} ${outTime}`;
				return {
					x: XAxis,
					y: cons.value,
				};
			}),
		},
	];

    return (
        <div className={styles.container}>
            <div className={styles.gridContainer}>
                <Box
                    height="100%"
                    weidth="100%"
                    display="grid"
                    columnGap={1}
                    rowGap={2}
                    p={3}
                    gridTemplateColumns="repeat(6, 1fr)"
                    gridTemplateRows="repeat(9, 1fr)"
                    sx={{
                        fontFamily: "Inter, sans-serif",
                        "& > *": {
                            border: "1px solid #000000",
                            backgroundColor: "#005355",
                            color: "white",
                            fontSize: "0.75rem",
                        },
                    }}
                >
                    <QuickViewComparison
                        background="rgb(248, 183, 108)"
                        color="white"
                        title="Electricity Usage"
                        percentage={2}
                        value={1842}
                        unit="kWh"
                    />
                    <QuickViewComparison
                        background="rgb(143, 150, 255)"
                        color="white"
                        title="Water Usage"
                        percentage={2}
                        value={1842}
                        unit="kWh"
                    />
                    <QuickViewComparison
                        background="rgb(255, 125, 125)"
                        color="white"
                        title="Gas Usage"
                        percentage={1}
                        value={285}
                        unit="m3"
                        unitDisplay={<>m<sup>3</sup></>}
                    />
                    <QuickViewComparison
                        background="rgb(58, 121, 69)"
                        color="white"
                        title="Today's Cost"
                        percentage={-2}
                        value={1077}
                        unit="£"
                    />
                    <QuickViewComparison
                        background="rgb(129, 129, 129)"
                        color="white"
                        title="Carbon Footprint"
                        percentage={-2}
                        value={194}
                        unit="kg"
                    />
                    <QuickViewBox
                        background="rgb(0, 130, 139)"
                        color="white"
                        title="Peak Demand"
                        value={194}
                        unit="kW"
                        icon="history_2"
                        iconColor="white"
                        desc="At 3:45 pm"
                        iconSize="1rem"
                    />

                    <GraphBox
                        title="Energy Consumption Graph"
                        LineData={consumpLineData}
                        tickFormat={tickString}
                        gridColumn="span 3" 
                        gridRow="span 4" 
                    />
                    <Box gridColumn="span 1" gridRow="span 4">
                        Building Status
                    </Box>
                    <Box gridColumn="span 1" gridRow="span 4">
                        Alert Log
                    </Box>
                    <Box 
                        gridColumn="span 1" 
                        gridRow="span 2"
                        backgroundColor="#5b6d62"
                        color="white"
                        padding={2}
                        border="1px solid black"
                        borderRadius={1}
                        fontSize="0.75rem"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        gap={1}
                    >
                        
                        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" flex={1} gap={1}>
                            <Icon iconKey="sensor_occupied" color="#2d332a" fontSize="3rem" />
                            <Box fontSize="1.2rem">Room Occupancy</Box>
                        </Box>
                        <Box fontSize="1rem">{OccupiedRooms}/{OccupancySensedRooms} Rooms Occupied</Box>
                    </Box>
                    <Box gridColumn="span 1" gridRow="span 6">
                        Floor By Floor Breakdown
                    </Box>
                    <GraphBox
                        title="Energy Forecast Graph"
                        LineData={consumpLineData}
                        tickFormat={tickString}
                        gridColumn="span 3" 
                        gridRow="span 4" 
                    />
                    <Box gridColumn="span 2" gridRow="span 3">
                        Top Consumers
                    </Box>
                    <Box 
                        gridColumn="span 2" 
                        gridRow="span 1"
                        backgroundColor="#2a2441"
                        color="white"
                        padding={2}
                        border="1px solid black"
                        borderRadius={1}
                        fontSize="0.75rem"
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        alignItems="center"
                        gap={1}
                    >
                        <Button sx={{ ...buttonStyles, padding:1, boxShadow: '0 2px 4px rgba(0,0,0,0.3)', backgroundColor:"#003b3c" }} onClick={() => navigate(`/${building}/Consumption`)}>
                            View Sensor/Meter Data
                        </Button>
                        <Button sx={{ ...buttonStyles, padding:1, boxShadow: '0 2px 4px rgba(0,0,0,0.3)', backgroundColor:"#003b3c"}} onClick={() => navigate(`/${building}/Forecast`)}>
                            View Sensor/Meter Forecasts
                        </Button>
                    </Box>
                </Box>
            </div>
        </div>
    );
};

export default Dashboard;
