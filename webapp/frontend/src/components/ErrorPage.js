import { Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const commonTypographyProps = { sx: { textAlign: "center" } };

const ErrorPage = () => {
  return (
    <Stack spacing={{ xs: 2, md: 0 }}>
      <Typography variant="h1" {...commonTypographyProps}>
        404.
      </Typography>
      <Typography variant="h6" {...commonTypographyProps}>
        In programming, that means there is no meaning of life
      </Typography>
      <Typography variant="h6" {...commonTypographyProps}>
        Or at least, none was found here
      </Typography>
      <Typography variant="h6" {...commonTypographyProps}>
        You may want to return{" "}
        <Link to="/" style={{ color: "inherit" }}>
          here
        </Link>
      </Typography>
    </Stack>
  );
};

export default ErrorPage;
