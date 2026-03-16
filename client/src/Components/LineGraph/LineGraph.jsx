import React, { useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import styles from "./LineGraph.module.css";
import { Box, Fade } from "@mui/material";

const DEFAULT_THEME = {
    fontFamily: "Comic Sans MS, cursive",
    text: {
        fontSize: 15,
        fill: "#fa000000",
        outlineWidth: 0,
        outlineColor: "transparent",
        fontFamily: "Comic Sans MS, cursive",
    },
    axis: {
        domain: {
            line: {
                stroke: "#ff000000",
                strokeWidth: 2,
            },
        },
        legend: {
            text: {
                fontSize: 25,
                fill: "#cc000000",
                outlineWidth: 0,
                outlineColor: "transparent",
                fontFamily: "Comic Sans MS, cursive",
            },
        },
        ticks: {
            text: {
                display: 'none',
                fontFamily: "Comic Sans MS, cursive",
            },
        },
    },
    grid: {
        line: {
            stroke: 'red',
            display: 'none'
        }
    },
    background: 'transparent'
}

const DEFAULT_AXIS_BOTTOM = {
        format: "%b %d",
        // tickValues: tickFormat,
        tickRotation: -45,
        legend: "Date",
        legendOffset: 20,
}
const DEFAULT_AXIS_LEFT = {
    orient: "left",
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: "Value",
    legendOffset: -50,
    legendPosition: "middle",
}

const MyResponsiveLine = ({
    LineData,
    LineColor,
    tickFormat,
    graphWidth,
    graphHeight,
    useToolTip = true,
    margin = { top: 20, right: 0, bottom: 20, left: 0 },
    theme,
    axisBottom,
    axisLeft,
    onPointHover = null,
    onPointLeave = null,
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

        return ({
            point: {
                x,
                y,
                data: { xFormatted, yFormatted },
            },
        }) => {
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

    const compiledTheme = {
        ...DEFAULT_THEME,
        ...theme,
    };

    const compiledAxisBottom = {
        ...DEFAULT_AXIS_BOTTOM,
        ...axisBottom
    };
    const compiledAxisLeft = {
        ...DEFAULT_AXIS_LEFT,
        ...axisLeft
    };

    return (
        <div onMouseLeave={handleMouseLeave} style={{ width: "100%", height: "100%" }}>
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
                    reverse: false,
                }}
                axisTop={null}
                axisRight={null}
                axisLeft={compiledAxisLeft}
                axisBottom={compiledAxisBottom}
                colors={[LineColor]}
                lineWidth={3}
                pointSize={0}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabel="y"
                pointLabelYOffset={-12}
                useMesh={true}
                curve="monotoneX"
                theme={compiledTheme}
                
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
    );
};

export default MyResponsiveLine;
