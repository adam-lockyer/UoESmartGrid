import React from "react";
import { Box } from "@mui/material";
import Icon from "../../Icon/Icon";

const AlertBox = () => {
    return (
        <Box
            gridColumn="span 1"
            gridRow="span 3"
            color="#333"
            padding={2}
            borderRadius={2}
            fontSize="0.75rem"
            display="flex"
            flexDirection="column"
            height="100%"
        >
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                fontSize="1.1rem"
                gap={1}
                paddingBottom={1}
                borderBottom="solid #333 2px"
            >
                Alert Log <Icon iconKey="add_circle" size="2rem" />
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                textAlign="center"
                alignItems="center"
                justifyContent="center"
                height="100%"
                fontSize="1rem"
                padding={1}
            >
                No Current Building Alerts
            </Box>
        </Box>
    );
};

export default AlertBox;
