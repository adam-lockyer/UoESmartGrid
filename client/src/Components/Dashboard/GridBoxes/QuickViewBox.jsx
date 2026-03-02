import { Box } from "@mui/material";
import React from "react";
import Icon from "../../Icon/Icon";

const QuickViewBox = ({
    background = "#005355",
    color = "white",
    title,
    value,
    unit,
    unitDisplay,
    desc,
    icon,
    iconColor,
    iconSize,
    titleIcon,
    titleIconColor="black"
}) => {
    return (
        <Box
            backgroundColor={background}
            color={color}
            padding={2}
            borderRadius={2}
            fontSize="0.75rem"
            display="flex"
            flexDirection="column"
            justifyContent="space-evenly"
            >
            <Box display="flex" flexDirection="row" alignItems="center" gap={1}><Icon iconKey={titleIcon} color={titleIconColor} fontSize="1.2rem" />{title}</Box>
            <Box sx={{ fontSize: "1.5rem" }}>
                {value} {unitDisplay || unit}
            </Box>
            <Box>
                <Box display="flex" alignItems="center" gap={0.5}>
                    <Icon iconKey={icon} color={iconColor} fontSize={iconSize} />
                    <Box>{desc}</Box>
                </Box>
            </Box>
        </Box>
    );
};

export default QuickViewBox;
