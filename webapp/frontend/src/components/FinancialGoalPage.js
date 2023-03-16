import { Typography, Button } from "@mui/material";
import React from "react";

const FinancialGoalPage = () => {
  return (
    <>
      <Typography variant="h1">Financial Goal</Typography>
      <Typography mb={1}>
        Coming soon ¯\_(ツ)_/¯ <br />
        Learning React-Django and working on this project in my spare time
        <br />
      </Typography>
      <Button
        variant="outlined"
        href="https://www.linkedin.com/in/bryan-tan-hoe-kin-60085b1b1/"
      >
        <Typography variant="button">Bryan</Typography>
      </Button>
    </>
  );
};

export default FinancialGoalPage;
