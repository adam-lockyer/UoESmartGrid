import { Box, styled } from "@mui/material";
import { forwardRef } from "react";

const Icon = forwardRef(function Icon(props, ref) {
  const { iconKey, ...other } = props;
  
  return (
    <Box
      ref={ref}
      fontFamily="Material Symbols Outlined"
      lineHeight={props.size}
      fontSize={props.size}
      width={props.size}
      height={props.size}
      sx={{
        ...props.sx,
        userSelect: 'none'
      }}
      {...other}
    >
      {iconKey}
    </Box>
  );
});

export default styled(Icon)({});