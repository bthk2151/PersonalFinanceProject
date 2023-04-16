import { Box } from "@mui/material";
import React from "react";

// MUI box for centering anything
const CenteredBox = ({ children, ...props }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      width="100%"
      height="100%"
      {...props}
    >
      {children}
    </Box>
  );
};

export default CenteredBox;
