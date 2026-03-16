import { Box, Button } from "@mui/material";
import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { nivoData } from "./mockData";

import QuickViewBox from "./GridBoxes/QuickViewBox";
import QuickViewComparison from "./GridBoxes/QuickViewComparison";
import GraphBox from "./GridBoxes/GraphBox";
import TopConsump from "./GridBoxes/TopConsump";
import AlertBox from "./GridBoxes/AlertBox";
import FloorBox from "./GridBoxes/FloorBox";
import PieGraphBox from "./GridBoxes/PieGraphBox";
import StatusBox from "./GridBoxes/StatusBox";

import { useDashboard } from "../../hook/useMAS";

const sharedBoxStyle = { display: "flex", alignItems: "center", columnGap: 0.5, rowGap: 0 };
const buttonStyles = {
    fontSize: "0.875rem",
    padding: "0",
    marginRight: "10px",
    marginLeft: "10px",
    color: "#ffffff",
};

const Dashboard = () => {
    const { building } = useParams();
    const navigate = useNavigate();
    const OccupiedRooms = 14;
    const OccupancySensedRooms = 43;
    const tickString = "every 5 minutes";
    const occPieData = [
        {
            id: "occupied",
            label: "Occupied",
            value: 14,
            color: "hsl(175, 22%, 20%)",
        },
        {
            id: "empty",
            label: "Empty",
            value: 29,
            color: "hsl(207, 48%, 29%)",
        },
    ];
    const heatPieData = [
        {
            id: "heatingOn",
            label: "Heatin On",
            value: 40,
            color: "hsl(175, 22%, 20%)",
        },
        {
            id: "heatingOff",
            label: "Heating Off",
            value: 3,
            color: "hsl(207, 48%, 29%)",
        },
    ];
    const wastePieData = [
        {
            id: "occHeating",
            label: "Occupied Rooms Heated",
            value: 14,
            color: "hsl(175, 22%, 20%)",
        },
        {
            id: "emptyHeating",
            label: "Empty Rooms Heated",
            value: 26,
            color: "hsl(207, 48%, 29%)",
        },
    ];
    const selfPowerPieData = [
        {
            id: "generated",
            label: "Power Generated (kWh)",
            value: 15602,
            color: "hsl(175, 22%, 20%)",
        },
        {
            id: "imported",
            label: "Power Imported (kWh)",
            value: 78431,
            color: "hsl(207, 48%, 29%)",
        },
    ];

    const masDashboardReq = {
        request: "DashboardLoad",
        data: "all",
    } 
    const { data, loading } = useDashboard({
		toPass: masDashboardReq,
	});
	if (loading) return <div>Loading...</div>
	console.log(data[0]);;

    const consumpLineData = [
        {
            id: "EnergyConsumption",
            color: "hsl(271, 70%, 50%)",
            data: (() => {
                const mappedData =
                    data[0].elecGraphData?.map((cons) => {
                        const timeEpoch = Date.parse(cons.datetime);
                        const outDate = new Date(timeEpoch).toISOString().substr(0, 10);
                        const outTime = new Date(timeEpoch).toISOString().substr(11, 5);
                        let XAxis = `${outDate} ${outTime}`;
                        return {
                            x: XAxis,
                            y: cons.value,
                        };
                    }) || [];

                if (mappedData.length > 1) {
                    const first = new Date(mappedData[0].x);
                    const second = new Date(mappedData[1].x);
                    const last = new Date(mappedData[mappedData.length - 1].x);

                    const intervalMs = second.getTime() - first.getTime();
                    const startTime = new Date(first.getTime() - intervalMs);
                    const endTime = new Date(last.getTime() + intervalMs);

                    // Format dates as "YYYY-MM-DD HH:MM" to match original format
                    const formatDate = (date) => {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, "0");
                        const day = String(date.getDate()).padStart(2, "0");
                        const hours = String(date.getHours()).padStart(2, "0");
                        const minutes = String(date.getMinutes()).padStart(2, "0");
                        return `${year}-${month}-${day} ${hours}:${minutes}`;
                    };

                    return [
                        { x: formatDate(startTime), y: mappedData[0].y },
                        ...mappedData,
                        { x: formatDate(endTime), y: mappedData[mappedData.length - 1].y },
                    ];
                }
                return mappedData;
            })(),
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.gridContainer}>
                <Box
                    display="grid"
                    columnGap={3}
                    rowGap={3}
                    p={3}
                    gridTemplateColumns="repeat(6, 1fr)"
                    gridTemplateRows="repeat(8, 1fr)"
                    sx={{
                        fontFamily: "Inter, sans-serif",
                        "& > *": {
                            //border: "1px solid #000000",
                            backgroundColor: "#ffffff",
                            color: "black",
                            fontSize: "0.75rem",
                        },
                    }}
                >
                    <QuickViewComparison
                        background="rgb(248, 183, 108)"
                        color="white"
                        title="Electricity Usage"
                        percentage={`${Math.round((((data[0].electric - data[0].yesterdayElectric) / data[0].yesterdayElectric) * 100) * 10) / 10}`}
                        value={data[0].electric}
                        unit="kWh"
                        titleIcon="electric_bolt"
                    />
                    <QuickViewComparison
                        background="rgb(143, 150, 255)"
                        color="white"
                        title="Water Usage"
                        percentage={`${Math.round((((data[0].water - data[0].yesterdayWater) / data[0].yesterdayWater) * 100) * 10) / 10}`}
                        value={data[0].water}
                        unit="Litres"
                        titleIcon="valve"
                    />
                    <QuickViewComparison
                        background="rgb(58, 121, 69)"
                        color="white"
                        title="Today's Cost"
                        percentage={-2}
                        value={1077}
                        unit="£"
                        titleIcon="payments"
                    />
                    <QuickViewComparison
                        background="rgb(129, 129, 129)"
                        color="white"
                        title="Carbon Footprint"
                        percentage={5}
                        value={`${Math.round((data[0].electric) * 0.117)}`}
                        unit="kg"
                        titleIcon="eco"
                    />
                    <QuickViewBox
                        background="rgb(255, 255, 255)"
                        color="#333"
                        title="Peak Electrical Demand"
                        value={data[0].peakElectric}
                        unit="kW"
                        icon="history_2"
                        iconColor="#333"
                        desc="At 3:45 pm"
                        iconSize="1.2rem"
                        titleIcon="leaderboard"
                    />
                    <QuickViewBox
                        background="rgb(255, 255, 255)"
                        color="#333"
                        title="Peak Water Demand"
                        value={data[0].peakWater}
                        unit="Litres"
                        icon="history_2"
                        iconColor="#333"
                        desc="At 3:45 pm"
                        iconSize="1.2rem"
                        titleIcon="leaderboard"
                    />
                    
                    <GraphBox
                        background="white"
                        color="#000000"
                        title="Energy Consumption Graph"
                        LineData={consumpLineData}
                        tickFormat={tickString}
                        gridColumn="span 2"
                        gridRow="span 2"
                    />
                    <StatusBox
                        background="white"
                        color="#333"
                        gridColumn="span 2"
                        gridRow="span 3"
                        title=""
                        temp={data[0].temperature}
                        airScore={data[0].airQual}
                        pvGen={data[0].solarEnergy}
                        noHVACenabled = {data[0].HVACDevicesOn}
                        totalNoHVAC = {data[0].HVACDevices}
                    />

                    <PieGraphBox
                        boxTitle="Room Occupancy"
                        pieData={occPieData}
                        centerText={`${Math.round((OccupiedRooms / OccupancySensedRooms) * 100)}%`}
                        iconKey="sensor_occupied"
                        bottomText={`${OccupiedRooms}/${OccupancySensedRooms} Rooms Occupied`}
                    />

                    <PieGraphBox
                        boxTitle="Heating Overview"
                        pieData={heatPieData}
                        centerText={`${Math.round((40 / 43) * 100)}%`}
                        iconKey="heat"
                        bottomText="40/43 Rooms Being Heated"
                    />

                    <GraphBox
                        title="Energy Forecast Graph"
                        LineData={consumpLineData}
                        tickFormat={tickString}
                        gridColumn="span 2"
                        gridRow="span 2"
                    />

                    <PieGraphBox
                        boxTitle="HVAC Wastage"
                        pieData={wastePieData}
                        centerText={`${Math.round((14 / 26) * 100)}%`}
                        iconKey="emergency_heat"
                        bottomText="26 Empty Rooms Heated"
                    />

                    <PieGraphBox
                        boxTitle="Self Made Power"
                        pieData={selfPowerPieData}
                        centerText={`${Math.round((selfPowerPieData[0].value / selfPowerPieData[1].value) * 100)}%`}
                        iconKey="battery_charging_80"
                        bottomText={`${Math.round((selfPowerPieData[0].value / selfPowerPieData[1].value) * 100)}% Self Reliant`}
                    />

                    <FloorBox />

                    <TopConsump />

                    <AlertBox />

                    <Box
                        gridColumn="span 1"
                        gridRow="span 1"
                        //backgroundColor="#2a2441"
                        color="#333"
                        padding={2}
                        //border="1px solid black"
                        borderRadius={2}
                        fontSize="0.75rem"
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        alignItems="center"
                        gap={1}
                    >
                        <Button
                            sx={{
                                ...buttonStyles,
                                padding: 1,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                                backgroundColor: "#003b3c",
                            }}
                            onClick={() => navigate(`/${building}/Forecast`)}
                        >
                            View Sensor/Meter Forecasts
                        </Button>
                    </Box>
                    <Box
                        gridColumn="span 1"
                        gridRow="span 1"
                        //backgroundColor="#2a2441"
                        color="#333"
                        padding={2}
                        //border="1px solid black"
                        borderRadius={2}
                        fontSize="0.75rem"
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        alignItems="center"
                        gap={1}
                    >
                        <Button
                            sx={{
                                ...buttonStyles,
                                padding: 1,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                                backgroundColor: "#003b3c",
                            }}
                            onClick={() => navigate(`/${building}/Consumption`)}
                        >
                            View Sensor/Meter Data
                        </Button>
                    </Box>
                    <Box
                        gridColumn="span 1"
                        gridRow="span 1"
                        //backgroundColor="#2a2441"
                        color="#333"
                        padding={2}
                        //border="1px solid black"
                        borderRadius={2}
                        fontSize="0.75rem"
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        alignItems="center"
                        gap={1}
                    >
                        <Button
                            sx={{
                                ...buttonStyles,
                                padding: 1,
                                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                                backgroundColor: "#003b3c",
                            }}
                            onClick={() => navigate(`/${building}/Consumption`)}
                        >
                            View asdgdgfsafaggf
                        </Button>
                    </Box>
                </Box>
            </div>
        </div>
    );
};

export default Dashboard;
