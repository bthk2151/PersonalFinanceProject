import { CreditCard, People, Savings } from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Button,
  Collapse,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import DatePickerField from "../util/DatePickerField";
import GridBox from "../util/GridBox";
import MoneyTextField from "../util/MoneyTextField";
import axios from "axios";
import { capitalizeWords } from "../util/util.js";

// ensure entryCategory state values are fixed by storing into a obj dict
const ENTRY_CATEGORIES = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
  DEBTOR_CREDITOR: "DEBTOR_CREDITOR",
};

const IncomeExpensesEntryForm = ({ refreshData }) => {
  const [entryCategory, setEntryCategory] = useState(ENTRY_CATEGORIES.INCOME);

  const [entryName, setEntryName] = useState("");

  const [entryAmount, setEntryAmount] = useState("");

  const [isMain, setIsMain] = useState(true);
  const [isNecessary, setIsNecessary] = useState(true);
  const [isDebtor, setIsDebtor] = useState(true); // if isDebtor == false, then it's a creditor
  const renderEntrySubtypeToggleButton = () => {
    if (entryCategory === ENTRY_CATEGORIES.INCOME)
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
    else if (entryCategory === ENTRY_CATEGORIES.EXPENSE)
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
    else if (entryCategory === ENTRY_CATEGORIES.DEBTOR_CREDITOR)
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

  const [entryDate, setEntryDate] = useState(dayjs(new Date()));

  // to store field respective error messages, if error exists
  const [entrySubmitErrors, setEntrySubmitErrors] = useState({
    name: null,
    amount: null,
    date: null,
  });

  // used when an entry creation is successful / unsuccessful, to display alert
  const [entryCreationStatus, setEntryCreationStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // validate and show error messages, if any field is invalid
    const errors = {
      name: !Boolean(entryName.trim())
        ? "Name is required"
        : entryName.trim().length > 200
        ? "Stop writing essay, bro"
        : null,
      amount: !Boolean(parseFloat(entryAmount))
        ? "Amount is required"
        : parseFloat(entryAmount) > 1000000
        ? "Don't kid yourself, bro"
        : null, // this means amount 0.00 is invalid as well
      date:
        entryCategory != ENTRY_CATEGORIES.DEBTOR_CREDITOR &&
        !entryDate.isValid()
          ? "Date is required"
          : null,
    };

    setEntrySubmitErrors(errors); // note: state will only change when re-rendered, NOT immediately!

    // proceed only if all fields are valid (all error message are null)
    if (!Object.values(errors).every((value) => value === null)) return;

    // all common params in create entry endpoints
    const params = {
      date: entryDate.format("YYYY-MM-DD"),
      name: entryName.trim(),
      amount: parseFloat(entryAmount),
    };

    // based on category of entry, define and map to endpoint and any other additional params required
    const endpointMap = {
      [ENTRY_CATEGORIES.INCOME]: {
        name: "Income",
        endpoint: "/api/create-income",
        additionalParams: { is_main: isMain },
      },
      [ENTRY_CATEGORIES.EXPENSE]: {
        name: "Expense",
        endpoint: "/api/create-expense",
        additionalParams: { is_necessary: isNecessary },
      },
      [ENTRY_CATEGORIES.DEBTOR_CREDITOR]: {
        name: isDebtor ? "Debtor" : "Creditor",
        endpoint: isDebtor ? "/api/create-debtor" : "/api/create-creditor",
        additionalParams: {},
      },
    };

    const { name, endpoint, additionalParams } = endpointMap[entryCategory];

    axios
      .post(endpoint, { ...params, ...additionalParams })
      .then((response) => {
        // collapse in the alert component to indicate successful creation
        setEntryCreationStatus({
          isSuccess: true,
          isIncomeOrDebtor:
            entryCategory === ENTRY_CATEGORIES.INCOME ||
            (entryCategory === ENTRY_CATEGORIES.DEBTOR_CREDITOR && isDebtor),
          message: `${name} entry (${entryName.trim()}) created successfully`,
        });

        // reset fields
        setEntryName("");
        setEntryAmount("");

        // refresh visuals in IncomeExpenseVisuals.js
        if (entryCategory != ENTRY_CATEGORIES.DEBTOR_CREDITOR)
          refreshData("INCOME_EXPENSE");
        else refreshData("DEBTOR_CREDITOR");
      })
      .catch((error) =>
        // collapse in the alert component to indicate error in creation
        setEntryCreationStatus({
          isSuccess: false,
          color: "warning", // mui theme keyword for orange color
          message: `ERROR: ${error.message}`,
        })
      );
  };

  const [suggestedEntries, setSuggestedEntries] = useState({
    top_main_income_entries: [],
    top_side_income_entries: [],
    top_necessary_expense_entries: [],
    top_luxury_expense_entries: [],
  });
  const [currentSuggestedEntries, setCurrentSuggestedEntries] = useState([]);
  // on component load, fetch most common entry names from db
  useEffect(() => {
    axios
      .get("/api/top-income-expense-entries")
      .then((response) => {
        setSuggestedEntries(response.data);
        setCurrentSuggestedEntries(response.data.top_main_income_entries); // since component load defaults as a main income entry
      })
      .catch((error) => console.log(error.message));
  }, []);

  // if income or expense entry, show suggested entry names
  useEffect(() => {
    if (entryCategory === ENTRY_CATEGORIES.DEBTOR_CREDITOR)
      setCurrentSuggestedEntries([]);
    else if (entryCategory === ENTRY_CATEGORIES.INCOME)
      setCurrentSuggestedEntries(
        isMain
          ? suggestedEntries.top_main_income_entries
          : suggestedEntries.top_side_income_entries
      );
    else if (entryCategory === ENTRY_CATEGORIES.EXPENSE)
      setCurrentSuggestedEntries(
        isNecessary
          ? suggestedEntries.top_necessary_expense_entries
          : suggestedEntries.top_luxury_expense_entries
      );
  }, [entryCategory, isMain, isNecessary]);

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Create an entry</Typography>
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
            <ToggleButton value={ENTRY_CATEGORIES.INCOME} color="success">
              <Savings sx={{ mr: 1 }} />
              <Typography variant="button">Income</Typography>
            </ToggleButton>
            <ToggleButton value={ENTRY_CATEGORIES.EXPENSE} color="error">
              <CreditCard sx={{ mr: 1 }} />
              <Typography variant="button">Expense</Typography>
            </ToggleButton>
            <ToggleButton value={ENTRY_CATEGORIES.DEBTOR_CREDITOR}>
              <People sx={{ mr: 1 }} />
              <Typography variant="button">Debtor / Creditor</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={7} md={6} paddingRight={1}>
          <Autocomplete
            freeSolo
            value={entryName}
            onInputChange={(_, newEntryName) =>
              setEntryName(capitalizeWords(newEntryName))
            }
            options={currentSuggestedEntries}
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
        <Grid item xs={7} md={3} sx={{ mb: { xs: 2, md: 0 } }}>
          {renderEntrySubtypeToggleButton()}
        </Grid>
        <Grid item xs={5} md={9} paddingRight={{ xs: 0, md: 1 }}>
          {entryCategory != ENTRY_CATEGORIES.DEBTOR_CREDITOR && (
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
        <Grid item xs={12} md={3} sx={{ mb: { xs: 0, md: 2 } }}>
          <GridBox justifyContent={{ xs: "flex-end", md: "flex-start" }}>
            <Button
              color={
                entryCategory === ENTRY_CATEGORIES.INCOME ||
                (entryCategory === ENTRY_CATEGORIES.DEBTOR_CREDITOR && isDebtor)
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
        <Grid item xs={12} md={10}>
          <Collapse
            in={entryCreationStatus != null}
            timeout={{ enter: 250, exit: 0 }} // entrance take 0.25 seconds, exit is instant
          >
            <Alert
              severity={entryCreationStatus?.isSuccess ? "success" : "warning"} // for icon
              color={
                entryCreationStatus?.isIncomeOrDebtor ? "success" : "error"
              } // mui keywords for the color green / red
              variant="outlined"
              onClose={() => setEntryCreationStatus(null)}
            >
              {entryCreationStatus?.message}
            </Alert>
          </Collapse>
        </Grid>
      </Grid>
    </form>
  );
};

export default IncomeExpensesEntryForm;
