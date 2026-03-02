import { Box } from "@mui/material";
import React from "react";
import Icon from "../../Icon/Icon";

const QuickViewComparison = ({
    background = "#005355",
    color = "#333",
    title,
    value,
    unit,
    unitDisplay,
    percentage,
    titleIcon=null
}) => {
    const isCurrency = unit === "£" || unit === "$";
    const isIncrease = percentage > 0;
    const icon = isIncrease ? "stat_3" : "stat_minus_3";
    const iconColor = isIncrease ? "#dd0000" : "#2cb30a";
    return (
        <Box
            //backgroundColor={background}
            color="#333"
            padding={2}
            //border="1px solid black"
            borderRadius={2}
            fontSize="0.75rem"
            display="flex"
            flexDirection="column"
            justifyContent="space-evenly"
        >
            <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" gap={1}>
                <Icon iconKey={titleIcon} fontSize="1.2rem"/>
                {title}
            </Box>

            <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                {isCurrency ? (
                    <Box sx={{ fontSize: "1.5rem" }}>
                        {unitDisplay || unit}
                        {value.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </Box>
                ) : (
                    <Box sx={{ fontSize: "1.5rem" }}>
                        {value} {unitDisplay || unit}
                    </Box>
                )}
                <Box>
                    <Box display="flex" flexDirection="row" alignItems="center">
                        <Icon iconKey={icon} color={iconColor} fontSize="2rem" />
                        <Box fontSize="1rem">
                            {isIncrease ? "+" : ""}
                            {percentage}%
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                flexDirection="row"
                gap={1}
            >
                <Icon
                    iconKey="crop_free"
                    color="#2d332a"
                    fontSize="2rem"
                    height="2rem"
                    width="2rem"
                    sx={{
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "3px",
                    }}
                />
                <Icon
                    iconKey="more_vert"
                    color="#2d332a"
                    fontSize="2rem"
                    height="2rem"
                    width="2rem"
                    sx={{
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "3px",
                    }}
                />
            </Box>
        </Box>
    );
};

export default QuickViewComparison;
