import React, { useState, useRef } from "react";
import MyResponsiveLine from "../../LineGraph/LineGraph"
import { Box, Button } from "@mui/material";
import { useContainerDimensions } from '../../../hook/useContainerDimensions';
import styles from "../../LineGraph/LineGraph.module.css";

import Icon from "../../Icon/Icon";

const GraphBox = ({ title, LineData, tickFormat, background, color, theme=null, margin=null, axisLeft=null, axisBottom=null, gridColumn=1, gridRow=1 }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const comsumpGraphRef = useRef(null)
    const { width, height } = useContainerDimensions(comsumpGraphRef)
    const [selectedButton, setSelectedButton] = useState(null);

    const chartMargin = margin || {
        top: 10,
        right: 0,
        bottom: 10,
        left: 0
    };
    const chartAxisLeft = axisLeft || {
        orient: "left",
        tickSize: 0,
        tickPadding: 0,
        tickRotation: 0,
        legend: "Value",
        legendOffset: 0,
        legendPosition: "middle"
    };
    const chartAxisBottom = axisBottom || {
        format: "%b %d",
        tickSize: 0,
        tickPadding: 0,
        tickRotation: 0,
        legend: "Date",
        legendOffset: 0
    };



    const buttonStyles={ fontSize: '0.875rem', padding:'0', marginRight:'10px', marginLeft:'10px', color:'#333' }

    return (
        <Box 
            ref={comsumpGraphRef} 
            gridColumn={gridColumn} 
            gridRow={gridRow}
            //border="1px solid black"
            borderRadius={2}
            fontSize="0.75rem"
            backgroundColor={background}
            color={color}
            justifyContent="space-evenly"
            padding={1}
            sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem', padding: 1 }}>
                <Box sx={{ fontSize: '0.875rem' }}>
                    {title}
                </Box>
                <Box>

                </Box>
                <Box sx={{ fontSize: '0.875rem', marginLeft: 'auto', minHeight: '24px', display: 'flex', alignItems: 'center' }}>
                    {hoveredPoint ? (
                        <Box display="flex" flexDirection="row" alignItems="center" gap={1}><Box fontSize="0.75rem" color="#5c5c5c">{hoveredPoint.data.xFormatted} </Box><Box fontWeight="bold"> | </Box><Box fontSize="0.9rem">{hoveredPoint.data.yFormatted} kWh</Box></Box>
                    ) : (
                        <>Hover over the graph to see values</>
                    )}
                </Box>
            </Box>
            <div style={{ display:"flex", alignItems:"center", flex: 1, minHeight: "40%", width: 'calc(100% + 32px)', margin: "0 -16px"}}>
                <MyResponsiveLine
                    LineData={LineData}
                    LineColor={"#333"}
                    tickFormat={tickFormat}
                    graphWidth={width}
                    graphHeight={height}
                    margin={ chartMargin }
                    theme={theme}
                    useToolTip={false}
                    axisLeft={chartAxisLeft}
                    axisBottom={chartAxisBottom}
                    onPointHover={setHoveredPoint}
                    onPointLeave={setHoveredPoint}
                />
            </div>
            <Box display="flex" alignItems="baseline" justifyContent="space-between" flexDirection="row" sx={{ padding: 1, gap: 1, marginRight: 1 }}>
                <Box display="flex" alignItems="baseline" flexDirection="row">
                    <Button sx={{
                        ...buttonStyles,
                        textDecoration: selectedButton === 'hourly' ? 'underline' : 'none'
                    }}
                        onClick={() => setSelectedButton('hourly')}
                    >
                        Hourly
                    </Button>
                    <>|</>
                    <Button sx={{
                        ...buttonStyles,
                        textDecoration: selectedButton === 'daily' ? 'underline' : 'none'
                    }}
                        onClick={() => setSelectedButton('daily')}
                    >
                        Daily
                    </Button>
                    <>|</>
                    <Button sx={{
                        ...buttonStyles,
                        textDecoration: selectedButton === 'weekly' ? 'underline' : 'none'
                    }}
                        onClick={() => setSelectedButton('weekly')}
                    >
                        Weekly
                    </Button>
                </Box>
                <Box display="flex" alignItems="baseline" flexDirection="row">
                    <Icon iconKey="crop_free" color="#2d332a" fontSize="2rem" />
                    <Icon iconKey="more_vert" color="#2d332a" fontSize="2rem" />
                </Box>
            </Box>
        </Box>
    );
};


export default GraphBox;