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
import React, { useEffect, useState } from "react";
import DatePickerField from "./util/DatePickerField";
import GridBox from "./util/GridBox";
import MoneyTextField from "./util/MoneyTextField";

const now = new Date();

const IncomeExpensesPage = () => {
  const [entryCategory, setEntryCategory] = useState("income");

  const [entryName, setEntryName] = useState("");

  const [entryAmount, setEntryAmount] = useState("");

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
          <ToggleButton value={true} color="success">
            <Typography variant="button">Main</Typography>
          </ToggleButton>
          <ToggleButton value={false} color="success">
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
          <ToggleButton value={true} color="error">
            <Typography variant="button">Necessary</Typography>
          </ToggleButton>
          <ToggleButton value={false} color="error">
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
          <ToggleButton value={true} color="success">
            <Typography variant="button">Debtor</Typography>
          </ToggleButton>
          <ToggleButton value={false} color="error">
            <Typography variant="button">Creditor</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      );
  };

  const [entryDate, setEntryDate] = useState(dayjs(now));

  // to store field respective error messages, if error exists
  const [entrySubmitErrors, setEntrySubmitErrors] = useState({
    name: null,
    amount: null,
    date: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // validate and show error messages, if any field is invalid
    const errors = {
      name: !Boolean(entryName.trim()) ? "Name is required" : null,
      amount: !Boolean(Number(entryAmount)) ? "Amount is required" : null, // this means amount 0.00 is invalid as well
      date:
        entryCategory != "debtor/creditor" && !entryDate.isValid()
          ? "Date is required"
          : null,
    };

    setEntrySubmitErrors(errors); // note: state will only change when re-rendered, NOT immediately!

    // proceed only if all fields are valid
    if (!Object.values(errors).every((value) => value === null)) return;

    console.log(
      "Category: " +
        entryCategory +
        " (" +
        (entryCategory === "income"
          ? isMain
            ? "main"
            : "side"
          : entryCategory === "expense"
          ? isNecessary
            ? "necessary"
            : "luxury"
          : isDebtor
          ? "debtor"
          : "creditor") +
        ")"
    );
    console.log(entryName);
    console.log(entryAmount);
    if (entryCategory != "debtor/creditor") console.log(entryDate.format());
  };

  useEffect(() => {
    // update list of "suggested" values for Autocomplete TextField
  }, [entryCategory, isMain, isNecessary, isDebtor]);

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Grid container rowSpacing={2}>
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
            <ToggleButton value="income" color="success">
              <Savings sx={{ mr: 1 }} />
              <Typography variant="button">Income</Typography>
            </ToggleButton>
            <ToggleButton value="expense" color="error">
              <CreditCard sx={{ mr: 1 }} />
              <Typography variant="button">Expense</Typography>
            </ToggleButton>
            <ToggleButton value="debtor/creditor">
              <People sx={{ mr: 1 }} />
              <Typography variant="button">Debtor / Creditor</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={7} md={6} paddingRight={1}>
          <Autocomplete
            freeSolo
            value={entryName}
            onInputChange={(_, newEntryName) => setEntryName(newEntryName)}
            options={["test"]}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Entry"
                helperText={entrySubmitErrors.name}
                error={Boolean(entrySubmitErrors.name)}
              />
            )}
          />
        </Grid>
        <Grid item xs={5} md={3} paddingRight={{ xs: 0, md: 1 }}>
          <MoneyTextField
            value={entryAmount}
            setValue={setEntryAmount}
            label="Amount"
            fullWidth
            helperText={entrySubmitErrors.amount}
            error={Boolean(entrySubmitErrors.amount)}
          />
        </Grid>
        <Grid item xs={7} md={3}>
          {renderEntrySubtypeToggleButton()}
        </Grid>
        <Grid item xs={5} md={9} paddingRight={{ xs: 0, md: 1 }}>
          {entryCategory != "debtor/creditor" && (
            <GridBox justifyContent="flex-end">
              <DatePickerField
                disableFuture
                label="Date"
                value={entryDate}
                onChange={(newEntryDate) => setEntryDate(newEntryDate)}
                slotProps={{
                  textField: {
                    helperText: entrySubmitErrors.date,
                    error: Boolean(entrySubmitErrors.date),
                  },
                }}
              />
            </GridBox>
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          <GridBox justifyContent={{ xs: "flex-end", md: "flex-start" }}>
            <Button
              color={
                entryCategory === "income" ||
                (entryCategory === "debtor/creditor" && isDebtor)
                  ? "success"
                  : "error" // expense or creditor
              }
              type="submit"
              variant="contained"
              size="large"
            >
              Create
            </Button>
          </GridBox>
        </Grid>
      </Grid>
    </form>
  );
};

export default IncomeExpensesPage;
