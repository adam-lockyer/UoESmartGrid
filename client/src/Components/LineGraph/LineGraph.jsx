import React, { useState } from 'react';
import { ResponsiveLine } from '@nivo/line'
import styles from "./LineGraph.module.css";
import { Box, Fade } from "@mui/material";



const MyResponsiveLine = ({ LineData, tickFormat, graphWidth, graphHeight, useToolTip=true,
    margin={ top: 20, right: 40, bottom: 60, left: 80 }, 
    theme={    
        "fontFamily": "Comic Sans MS, cursive",
        "text": {
        "fontSize": 15,
        "fill": "#ffffff",
        "outlineWidth": 0,
        "outlineColor": "transparent",
        "fontFamily": "Comic Sans MS, cursive"
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
                    "outlineColor": "transparent",
                    "fontFamily": "Comic Sans MS, cursive"
                }
            },
            "ticks": {
                "text": {
                    "fontFamily": "Comic Sans MS, cursive"
                }
            }
        }
    },
    axisBottom={
        format: "%b %d",
        // tickValues: tickFormat,
        tickRotation: -45,
        legend: "Date",
        legendOffset: 20
    },
    axisLeft={
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Value",
        legendOffset: -50,
        legendPosition: "middle"
    },
    onPointHover=null,
    onPointLeave=null
    }) => {
        const [hoveredPoint, setHoveredPoint] = useState(null);
        const handleMouseMove = (point) => {
            setHoveredPoint(point);
            onPointHover?.(point);
        };
        const handleMouseLeave = () => {
            setHoveredPoint(null);
            onPointLeave?.();
        };
        const getTooltip = () => {
            if (!useToolTip) {
                return () => null; 
            }
            
            return ({ point: { x, y, data: { xFormatted, yFormatted } } }) => {
                const tooltipWidth = 120;
                const tooltipHeight = 60;
                const padding = 10;
                
                let translateX = 0;
                let translateY = 0;
                
                // Horizontal positioning
                if (x + tooltipWidth + padding > graphWidth) {
                    translateX = -tooltipWidth - padding;
                } else {
                    translateX = padding;
                }
                
                // Vertical positioning
                if (y + tooltipHeight + padding > graphHeight) {
                    translateY = -tooltipHeight - padding;
                } else {
                    translateY = padding;
                }
                
                return (
                    <div 
                        className={styles.toolTipContainer}
                        style={{ transform: `translate(${translateX}px, ${translateY}px)` }}
                    >
                        <div>Time: {xFormatted}</div>
                        <div>Value: {yFormatted}</div>
                    </div>
                );
            };
        };
        
        return (
            <div onMouseLeave={handleMouseLeave} style={{ width: '100%', height: '100%' }}>
                <ResponsiveLine
                data={LineData}
                tooltip={getTooltip()}
                onMouseMove={handleMouseMove}
                margin={margin}
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
                axisLeft={axisLeft}
                axisBottom={axisBottom}
                colors={{ scheme: "nivo" }}
                pointSize={8}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabel="y"
                pointLabelYOffset={-12}
                useMesh={true}
                theme={theme}
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
            </div>
        )
};

export default MyResponsiveLine