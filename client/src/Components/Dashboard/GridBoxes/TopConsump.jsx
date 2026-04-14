import React from "react";
import { Box } from "@mui/material";

const TopConsump = ({
    background = "#005355",
    color = "#333",
    title,
    value,
    unit,
    unitDisplay,
    percentage,
    titleIcon = null,
}) => {
    return (
        <Box
            gridColumn="span 2"
            gridRow="span 3"
            color="#333"
            padding={2}
            borderRadius={2}
            fontSize="1rem"
            display="flex"
            flexDirection="column"
            height="100%"
        >
            Top Consumers
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="100%"
                margin={2}
            >
                <Box fontSize="1rem">
                    Electrical
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-evenly"
                        fontSize="0.75rem"
                    >
                        <Box>Device</Box>
                        <Box>Room</Box>
                        <Box>Floor</Box>
                    </Box>
                </Box>
                <Box fontSize="1rem">
                    HVAC
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-evenly"
                        fontSize="0.75rem"
                    >
                        <Box>Ventilation Devices</Box>
                        <Box>FCUs/Radiators</Box>
                        <Box>Major Building Devices</Box>
                    </Box>
                </Box>
                <Box fontSize="1rem">
                    Water and Thermal
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-evenly"
                        fontSize="0.75rem"
                    >
                        <Box>Cold Water Meters</Box>
                        <Box>Heating Thermal Meters</Box>
                        <Box>Cooling Thermal Meter</Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default TopConsump;
