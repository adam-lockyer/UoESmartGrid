import { Box } from "@mui/material";
import React from "react";
import Icon from "../../Icon/Icon";


const QuickViewBox = ({ background = '#005355', color = "white", title, value, unit, unitDisplay, desc, icon, iconColor, iconSize }) => {

    return (
        <Box backgroundColor={background} color={color} padding={2} border="1px solid black" borderRadius={1} fontSize="0.75rem">
            {title}
            <Box sx={{ fontSize: "1.5rem",}}>
                {value} {unitDisplay || unit}
            </Box>
            <Box >
                <Box display="flex" alignItems="center" gap={0.5}>
                    <Icon
                        iconKey={icon}
                        color={iconColor}
                        fontSize={iconSize}
                    />
                    <Box>
                        {desc}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default QuickViewBox;
