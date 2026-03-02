import React from "react";
import { Box } from "@mui/material";

const FloorBox = () => {
    return (
        <Box
            gridColumn="span 2"
            gridRow="span 4"
            color="#333"
            padding={2}
            borderRadius={2}
            fontSize="1rem"
            display="flex"
            flexDirection="column"
            height="100%"
        >
            Floor By Floor Breakdown
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="100%"
                margin={2}
            >
                <Box fontSize="1rem">
                    Basement
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-evenly"
                        fontSize="0.75rem"
                    >
                        <Box>Meters</Box>
                        <Box>Devices</Box>
                        <Box>Rooms</Box>
                    </Box>
                </Box>
                <Box fontSize="1rem">
                    Ground Floor
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-evenly"
                        fontSize="0.75rem"
                    >
                        <Box>Meters</Box>
                        <Box>Devices</Box>
                        <Box>Rooms</Box>
                    </Box>
                </Box>
                <Box fontSize="1rem">
                    First Floor
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-evenly"
                        fontSize="0.75rem"
                    >
                        <Box>Meters</Box>
                        <Box>Devices</Box>
                        <Box>Rooms</Box>
                    </Box>
                </Box>
                <Box>
                    Roof
                    <Box display="flex" flexDirection="row" justifyContent="space-evenly">
                        <Box>Meters</Box>
                        <Box>Devices</Box>
                        <Box>Rooms</Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default FloorBox;
