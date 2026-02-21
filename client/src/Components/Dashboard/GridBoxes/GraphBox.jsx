import React, { useState, useRef } from "react";
import MyResponsiveLine from "../../LineGraph/LineGraph"
import { Box, Button } from "@mui/material";
import { useContainerDimensions } from '../../../hook/useContainerDimensions';
import styles from "../../LineGraph/LineGraph.module.css";

const GraphBox = ({ title, LineData, tickFormat, theme=null, margin=null, axisLeft=null, axisBottom=null, gridColumn=1, gridRow=1 }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const comsumpGraphRef = useRef(null)
    const { width, height } = useContainerDimensions(comsumpGraphRef)
    const chartTheme = theme || {
        fontFamily: "Inter, sans-serif",
        text: {
            fontSize: 10,
            fill: "#ffffff",
            outlineWidth: 0,
            outlineColor: "transparent",
            fontFamily: "Inter, sans-serif"
        },
        axis: {
            domain: {
                line: {
                    stroke: "#ffffff",
                    strokeWidth: 2
                }
            },
            legend: {
                text: {
                    fontSize: 12,
                    fill: "#ffffff",
                    outlineWidth: 0,
                    outlineColor: "transparent",
                    fontFamily: "Inter, sans-serif"
                }
            },
            ticks: {
                text: {
                    fontFamily: "Inter, sans-serif"
                }
            }
        }
    };
    const chartMargin = margin || {
        top: 10,
        right: 5,
        bottom: 30,
        left: 50
    };
    const chartAxisLeft = axisLeft || {
        orient: "left",
        tickSize: 2,
        tickPadding: 2,
        tickRotation: 0,
        legend: "Value",
        legendOffset: -45,
        legendPosition: "middle"
    };
    const chartAxisBottom = axisBottom || {
        format: "%b %d",
        tickSize: 2,
        tickPadding: 2,
        tickRotation: 0,
        legend: "Date",
        legendOffset: 25
    };

    const buttonStyles={ fontSize: '0.875rem', padding:'0', marginRight:'10px', marginLeft:'10px', color:'#ffffff' }

    return (
        <Box 
            ref={comsumpGraphRef} 
            gridColumn={gridColumn} 
            gridRow={gridRow}
            padding={1}
            border="1px solid black"
            borderRadius={1}
            fontSize="0.75rem"
            backgroundColor='#4a5d69'
            sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem'}}>
                <Box sx={{ fontSize: '0.875rem' }}>
                    {title}
                </Box>
                <Box>
                    <Button sx={buttonStyles}
                        onClick={() => console.log("Displaying Hourly Graph")}
                    >
                        Hourly
                    </Button>
                    <>|</>
                    <Button sx={buttonStyles}
                        onClick={() => console.log("Displaying Daily Graph")}
                    >
                        Daily
                    </Button >
                    <>|</>
                    <Button sx={buttonStyles}
                        onClick={() => console.log("Displaying Weekly Graph")}
                    >
                        Weekly
                    </Button>
                </Box>
                <Box sx={{ fontSize: '0.875rem', marginLeft: 'auto' }}>
                    {hoveredPoint ? (
                        <>Date: {hoveredPoint.data.xFormatted} | Value: {hoveredPoint.data.yFormatted}</>
                    ) : (
                        <>Hover over the graph to see values</>
                    )}
                </Box>
            </Box>
            <div className={styles.graphDisplaying} style={{ flex: 1, width: '100%', height:"80%"}}>
                <MyResponsiveLine
                    LineData={LineData}
                    tickFormat={tickFormat}
                    graphWidth={width}
                    graphHeight={height}
                    theme={chartTheme}
                    margin={ chartMargin }
                    useToolTip={false}
                    axisLeft={chartAxisLeft}
                    axisBottom={chartAxisBottom}
                    onPointHover={setHoveredPoint}
                    onPointLeave={setHoveredPoint}
                />
            </div>
        </Box>
    );
};


export default GraphBox;