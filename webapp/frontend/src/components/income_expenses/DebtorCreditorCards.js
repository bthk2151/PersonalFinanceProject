import { Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import DebtorCreditorUnsettledCard from "./DebtorCreditorUnsettledCard";
import axios from "axios";

const DebtorCreditorCards = ({ debtorCreditorRefreshSignal, refreshData }) => {
  const [debtorCreditorData, setDebtorCreditorData] = useState([]);

  useEffect(() => {
    // get unsettled debtor and creditor data
    axios
      .get(`/api/debtor-creditor-list`)
      .then((response) => setDebtorCreditorData(response.data))
      .catch((error) => console.log(error.message));
  }, [debtorCreditorRefreshSignal]);

  return debtorCreditorData.length > 0 ? (
    <>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">
            {"Unsettled Debtors & Creditors"}
          </Typography>
        </Grid>
        {debtorCreditorData.map((entry, index) => (
          <Grid
            item
            xs={12}
            md={4}
            key={entry.id}
            paddingX={{ xs: 0, md: (index + 2) % 3 === 0 ? 1 : 0 }} // some math to determine the required spacing
          >
            <DebtorCreditorUnsettledCard
              entry={entry}
              refreshData={refreshData}
            />
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ marginY: 3 }} />
    </>
  ) : (
    <></>
  );
};

export default DebtorCreditorCards;
