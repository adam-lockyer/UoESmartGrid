import { Box } from "@mui/material";
import React from "react";
import Icon from "../../Icon/Icon";

const QuickViewComparison = ({
    background = "#005355",
    color = "white",
    title,
    value,
    unit,
    unitDisplay,
    percentage,
}) => {
    const isCurrency = unit === "£" || unit === "$";
    const isIncrease = percentage > 0;
    const icon = isIncrease ? "stat_3" : "stat_minus_3";
    const iconColor = isIncrease ? "#a70000" : "#51ff01";
    return (
        <Box
            backgroundColor={background}
            color={color}
            padding={2}
            border="1px solid black"
            borderRadius={1}
            fontSize="0.75rem"
        >
            {title}
            {isCurrency ? (
                <Box sx={{ fontSize: "1.5rem" }}>
                    {unitDisplay || unit}{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Box>
            ) : (
                <Box sx={{ fontSize: "1.5rem" }}>
                    {value} {unitDisplay || unit}
                </Box>
            )}
            <Box>
                <Box display="flex" alignItems="center">
                    <Icon iconKey={icon} color={iconColor} fontSize="1.25rem" />
                    <Box>
                        {percentage}% {isIncrease ? "Increase" : "Decrease"}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default QuickViewComparison;
