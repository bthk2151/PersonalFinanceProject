import { CreditCard, People, Savings } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useState } from "react";
import DatePickerField from "./util/DatePickerField";
import GridBox from "./util/GridBox";
import MoneyTextField from "./util/MoneyTextField";

const now = new Date();

const IncomeExpensesPage = () => {
  const [entryCategory, setEntryCategory] = useState("income");

  const [isMain, setIsMain] = useState(true);
  const [isNecessary, setIsNecessary] = useState(true);
  const [isDebtor, setIsDebtor] = useState(true); // if isDebtor == false, then it's a creditor
  const renderEntrySubtypeToggleButton = () => {
    if (entryCategory === "income")
      return (
        <ToggleButtonGroup
          value={isMain}
          exclusive
          onChange={(_, selectedIsMain) =>
            selectedIsMain !== null ? setIsMain(selectedIsMain) : null
          }
        >
          <ToggleButton value={true}>
            <Typography variant="button">Main</Typography>
          </ToggleButton>
          <ToggleButton value={false}>
            <Typography variant="button">Side</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      );
    else if (entryCategory === "expense")
      return (
        <ToggleButtonGroup
          value={isNecessary}
          exclusive
          onChange={(_, selectedIsNecessary) =>
            selectedIsNecessary !== null
              ? setIsNecessary(selectedIsNecessary)
              : null
          }
        >
          <ToggleButton value={true}>
            <Typography variant="button">Necessary</Typography>
          </ToggleButton>
          <ToggleButton value={false}>
            <Typography variant="button">Luxury</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      );
    else if (entryCategory === "debtor/creditor")
      return (
        <ToggleButtonGroup
          value={isDebtor}
          exclusive
          onChange={(_, selectedIsDebtor) =>
            selectedIsDebtor !== null ? setIsDebtor(selectedIsDebtor) : null
          }
        >
          <ToggleButton value={true}>
            <Typography variant="button">Debtor</Typography>
          </ToggleButton>
          <ToggleButton value={false}>
            <Typography variant="button">Creditor</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      );
  };

  const [date, setDate] = useState(dayjs(now));

  return (
    <Grid container rowSpacing={{ xs: 2, md: 1 }}>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Create an entry</Typography>
      </Grid>
      <Grid item xs={12}>
        <ToggleButtonGroup
          value={entryCategory}
          exclusive
          size="large"
          onChange={(_, selectedEntryCategory) =>
            selectedEntryCategory !== null
              ? setEntryCategory(selectedEntryCategory)
              : null
          }
        >
          <ToggleButton value="income">
            <Savings sx={{ mr: 1 }} />
            <Typography variant="button">Income</Typography>
          </ToggleButton>
          <ToggleButton value="expense">
            <CreditCard sx={{ mr: 1 }} />
            <Typography variant="button">Expense</Typography>
          </ToggleButton>
          <ToggleButton value="debtor/creditor">
            <People sx={{ mr: 1 }} />
            <Typography variant="button">Debtor / Creditor</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid item xs={8} md={6} paddingRight={1}>
        <Autocomplete
          freeSolo
          options={[]}
          renderInput={(params) => (
            <TextField {...params} fullWidth label="Entry" />
          )}
        />
      </Grid>
      <Grid item xs={4} md={3} paddingRight={{ xs: 0, md: 1 }}>
        <MoneyTextField label="Amount" fullWidth />
      </Grid>
      <Grid item xs={7} md={3}>
        {renderEntrySubtypeToggleButton()}
      </Grid>
      <Grid item xs={5} md={9} paddingRight={{ xs: 0, md: 1 }}>
        <GridBox justifyContent="flex-end">
          <DatePickerField
            maxDate={dayjs(now)}
            label="Date"
            value={date}
            onChange={(newDate) => setDate(newDate)}
          />
        </GridBox>
      </Grid>
      <Grid item xs={12} md={3}>
        <GridBox justifyContent={{ xs: "flex-end", md: "flex-start" }}>
          <Button variant="contained" size="large">
            Create
          </Button>
        </GridBox>
      </Grid>
    </Grid>
  );
};

export default IncomeExpensesPage;
