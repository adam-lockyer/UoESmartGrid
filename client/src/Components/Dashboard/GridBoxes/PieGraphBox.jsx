import React from "react";
import { Box } from '@mui/material';
import Icon from "../../Icon/Icon";
import PieChart from "../../PieChart/PieChart";

const PieGraphBox = ({
    boxTitle,
    pieData,
    centerText = "",
    bottomText = "",
    iconKey = "pie_chart",
    iconColor = "#2d332a",
    iconSize = "3rem",
}) => {
    return (
        <Box
            gridColumn="span 1"
            gridRow="span 2"
            //backgroundColor="#5b6d62"
            color="#333"
            padding={2}
            //border="1px solid black"
            borderRadius={2}
            fontSize="0.75rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={1}
        >
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                flex={1}
                gap={1}
            >
                <Icon iconKey={iconKey} color={iconColor} fontSize={iconSize} />
                <Box fontSize="1.2rem">{boxTitle}</Box>
            </Box>
            <Box sx={{ width: "100%", height: "100%" }}>
                <PieChart data={pieData} centerText={centerText} />
            </Box>
            <Box fontSize="1rem">{bottomText}</Box>
        </Box>
    );
};

export default PieGraphBox;
