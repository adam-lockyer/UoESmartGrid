import React from 'react';
import { ResponsiveLine } from '@nivo/line'
import styles from "./LineGraph.module.css";
import { Box } from '@mui/material';

const MyResponsiveLine = ({ LineData, tickFormat, graphWidth, graphHeight }) => (
    <ResponsiveLine
    data={LineData}
    tooltip={({
        point: {
            x,
            y,
            data: { xFormatted, yFormatted },
        },
    }) => {
        const moveModifier = (x / graphWidth) * 125;
        console.log(graphWidth)
        console.log(moveModifier);


        // !!! FIX TRANSLATION OF TOOLTIP
        return (
            <Box className={`${styles.toolTipContainer}`} sx={{
                transform: `translateX(${x > (graphWidth / 2) ? moveModifier * -1: moveModifier }px)`
            }}>
                <div>Time: {xFormatted}</div>
                <div>Value: {yFormatted}</div>
            </Box>
        );
    }}
    margin={{ top: 20, right: 40, bottom: 60, left: 80 }}
    xScale={{
        type: "time",
        format: "%Y-%m-%d %H:%M",
    }}
    xFormat="time:%Y-%m-%d %H:%M"
    yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false
    }}
    axisTop={null}
    axisRight={null}
    axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Value",
        legendOffset: -50,
        legendPosition: "middle"
    }}
    axisBottom={{
        format: "%b %d",
        // tickValues: tickFormat,
        tickRotation: -45,
        legend: "Date",
        legendOffset: 20
    }}
    colors={{ scheme: "nivo" }}
    pointSize={8}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabel="y"
    pointLabelYOffset={-12}
    useMesh={true}
    theme={{    
        "text": {
        "fontSize": 15,
        "fill": "#ffffff",
        "outlineWidth": 0,
        "outlineColor": "transparent"
        },
        "axis": {
            "domain": {
                "line": {
                    "stroke": "#ffffff",
                    "strokeWidth": 2
                }
            },
            "legend": {
                "text": {
                    "fontSize": 25,
                    "fill": "#ffffff",
                    "outlineWidth": 0,
                    "outlineColor": "transparent"
                }
            },
        }
    }}
    // legends={[
    //     {
    //     anchor: "bottom-right",
    //     direction: "column",
    //     justify: false,
    //     translateX: 100,
    //     translateY: 0,
    //     itemsSpacing: 0,
    //     itemDirection: "left-to-right",
    //     itemWidth: 80,
    //     itemHeight: 20,
    //     itemOpacity: 0.75,
    //     symbolSize: 12,
    //     symbolShape: "circle",
    //     symbolBorderColor: "rgba(0, 0, 0, .5)",
    //     effects: [
    //         {
    //         on: "hover",
    //         style: {
    //             itemBackground: "rgba(0, 0, 0, .03)",
    //             itemOpacity: 1
    //         }
    //         }
    //     ]
    //     }
    // ]}
    />
)

export default MyResponsiveLine