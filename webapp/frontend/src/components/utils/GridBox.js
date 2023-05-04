import { Box } from "@mui/material";
import React from "react";

// because MUI Grid component is created using css flex, this util GridBox is made for positioning children within a MUI Grid item
const GridBox = ({ children, ...props }) => {
  return (
    <Box display="flex" {...props}>
      {children}
    </Box>
  );
};

export default GridBox;
