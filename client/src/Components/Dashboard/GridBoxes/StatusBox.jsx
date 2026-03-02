import { Box, Chip, Typography } from "@mui/material";
import React from "react";
import Icon from "../../Icon/Icon";
import { useNavigate } from "react-router-dom";

const StatusBox = ({ background, color, title, gridColumn, gridRow }) => {
    const navigate = useNavigate();
    const temp = 22;
    const noHVACenabled = 13;
    const tempColour = temp > 20 ? (temp > 24 ? "red" : "orange") : temp < 18 ? "blue" : "green";
    const airScore = 96
    const airScoreColour = airScore > 50 ? (airScore > 75 ? "green" : "yellow") : airScore < 25 ? "red" : "orange";
    const pvGen = 15.6
    return (
        <Box
            backgroundColor={background}
            color={color}
            padding={1}
            //border="1px solid black"
            borderRadius={2}
            fontSize="0.75rem"
            gridColumn={gridColumn}
            gridRow={gridRow}
            height="100%"
            width="100%"
            display="flex"
            flexDirection="column"
        >
            <Box paddingBottom={1}>{title}</Box>
            <Box
                width="100%"
                maxWidth="100%"
                height="100%"
                display="grid"
                justifyContent="space-evenly"
                gridTemplateColumns="repeat(2, 1fr)"
                gridTemplateRows="repeat(2, 1fr)"
                rowGap={2}
                position="relative"
                sx={{
                    '&:after': {
                        content: "' '",
                        display: 'block',
                        width: '2px',
                        height: '100%',
                        background: '#202020',
                        position: 'absolute',
                        left: '50%',
                        top: '0'
                    },
                    '&:before': {
                        content: "' '",
                        display: 'block',
                        width: '100%',
                        height: '2px',
                        background: '#202020',
                        position: 'absolute',
                        left: '0',
                        top: '50%'
                    }
                }}
            >
                <Box
                    onClick={() => navigate(`/${building}/TempGraph`)}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-around"
                    alignItems="center"
                    padding={1}
                    gap={0.5}
                    width="100%"
                    height="100%"
                >
                    <Box display="flex" flexDirection="column" justifyContent="start" alignItems="center" gap={0.25} fontSize="0.5rem">
                        <Icon iconKey="device_thermostat" color="#c52e2e" size="3rem"/>
                        <Typography variant="body1" textAlign="center">Temperature</Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" justifyContent="start" alignItems="center" marginTop={1}>
                        <Box fontSize="1.5rem" fontWeight="bold" letterSpacing="1px" color={tempColour}>{temp}<sup>o</sup>C</Box>
                        <Box>Building Average</Box>
                    </Box>
                </Box>
                <Box
                    onClick={() => navigate(`/${building}/HVACDevices`)}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-around"
                    alignItems="center"
                    padding={1}
                    gap={0.5}
                    width="100%"
                    height="100%"
                >
                    <Box display="flex" flexDirection="column" justifyContent="start" alignItems="center" gap={0.25} fontSize="0.5rem">
                        <Icon iconKey="hvac" color="#ff8521" size="3rem" />
                        <Typography variant="body1" textAlign="center">HVAC</Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" justifyContent="start" alignItems="center" marginTop={1}>
                        <Box fontSize="1.5rem" fontWeight="bold" letterSpacing="1px"  color="#6b6b88">{noHVACenabled} / 75</Box>
                        <Box>Devices Running</Box>
                    </Box>
                </Box>


                <Box
                    onClick={() => navigate(`/${building}/TempGraph`)}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-around"
                    alignItems="center"
                    padding={1}
                    gap={0.5}
                    width="100%"
                    height="100%"
                >
                    <Box display="flex" flexDirection="column"justifyContent="start" alignItems="center" gap={0.25} fontSize="0.5rem">
                        <Icon iconKey="aq_indoor" color="#4cc9fa" size="3rem" />
                        <Typography variant="body1" textAlign="center">Air Quality</Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" justifyContent="start" alignItems="center" marginTop={1}>
                        <Box fontSize="1.5rem" fontWeight="bold" letterSpacing="1px" color={airScoreColour}>{airScore}%</Box>
                        <Box>
                            <Chip variant="filled" color="success" label="Excellent" />
                        </Box>
                    </Box>

                </Box>


                <Box
                    onClick={() => navigate(`/${building}/TempGraph`)}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-around"
                    alignItems="center"
                    padding={1}
                    gap={0.5}
                    width="100%"
                    height="100%"
                >
                    <Box display="flex" flexDirection="column" justifyContent="start" alignItems="center" gap={0.25} fontSize="0.5rem">
                        <Icon iconKey="solar_power" color="#fac840" size="3rem" />
                        <Typography variant="body1" textAlign="center">Solar Energy</Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" justifyContent="start" alignItems="center" marginTop={1}>
                        <Box display="flex" alignItems="baseline" gap="0.25rem" fontSize="1.5rem" color="#6b6b88" fontWeight="bold" letterSpacing="1px"><Box>{pvGen}</Box><Box fontSize="0.9rem">MWh</Box></Box>
                        <Box>Generated</Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default StatusBox;
