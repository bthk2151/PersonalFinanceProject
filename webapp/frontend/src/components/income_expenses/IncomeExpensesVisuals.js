import {
  Box,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import GridBox from "../util/GridBox";
import axios from "axios";
import {
  formatCurrency,
  formatDate,
  intDayToShortDay,
  isSmallScreen,
} from "../util/util";
import { Delete } from "@mui/icons-material";
import IncomeExpensesConfirmDeleteEntryDialog from "./IncomeExpensesConfirmDeleteEntryDialog";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

const IncomeExpensesVisuals = ({ refreshData, refreshSignal }) => {
  const [month, setMonth] = useState(dayjs(new Date())); // always default visuals to current month

  const commonColumnProps = { sortable: false }; // common column props to be applied on each datagrid column
  const columns = useMemo(
    () => [
      {
        field: "day_of_week",
        headerName: "Day",
        valueFormatter: (params) => intDayToShortDay(params.value),
        flex: 0.4,
        ...commonColumnProps,
      },
      {
        field: "date",
        headerName: "Date",
        type: "date",
        valueGetter: (params) => dayjs(params.value), // raw column data
        valueFormatter: (params) => formatDate(params.value, isSmallScreen()), // formatted column data, if small screen, use short form DD/MM display
        flex: 0.6,
        ...commonColumnProps,
      },
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        renderCell: (params) => (
          <Tooltip title={params.value} enterTouchDelay={0}>
            <Box component="span">{params.value}</Box>
          </Tooltip>
        ),
        ...commonColumnProps,
      },
      {
        field: "amount",
        headerName: "Amount",
        type: "number",
        renderCell: (params) => (
          <Chip
            label={formatCurrency(params.value)}
            color={params.row.type === "I" ? "success" : "error"}
            size="small"
            variant="outlined"
          />
        ),
        flex: 1,
        ...commonColumnProps,
      },
      {
        field: "actions",
        type: "actions",
        getActions: (params) => [
          <GridActionsCellItem
            icon={
              <Tooltip title="Delete">
                <Delete />
              </Tooltip>
            }
            onClick={() => handleDeleteRow(params.row)}
            label="Delete"
          />,
        ],
        flex: 0.1,
        ...commonColumnProps,
      },
    ],
    []
  );

  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(
        `/api/income-expense-list?month=${
          month.month() + 1
        }&year=${month.year()}`
      )
      .then((response) =>
        setData(
          response.data.map((entry) => ({
            ...entry,
            uniqueId: entry.type + entry.id, // a unique identifier for each row, since entries are pulled from both income and expense table
          }))
        )
      )
      .catch((error) => console.log(error.message));
  }, [month, refreshSignal]);

  const [confirmDeleteEntryDialogOpen, setConfirmDeleteEntryDialogOpen] =
    useState(false);
  const [deleteEntryRow, setDeleteEntryRow] = useState({});
  const handleDeleteRow = (row) => {
    console.log(row);
    setDeleteEntryRow(row); // save to state all data of delete row, this will be used in the delete entry dialog
    setConfirmDeleteEntryDialogOpen(true);
  };

  return (
    <>
      <Grid container rowSpacing={2}>
        <Grid item xs={7}>
          <Typography variant="h6">Income & Expenses</Typography>
        </Grid>
        <Grid item xs={5}>
          <GridBox justifyContent="flex-end">
            <DatePicker
              views={["year", "month"]}
              disableFuture
              value={month}
              onChange={(newMonth) =>
                dayjs(newMonth).isValid()
                  ? setMonth(newMonth)
                  : dayjs(new Date())
              }
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
            />
          </GridBox>
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.uniqueId} // MUI datagrid mandates that all rows need a unique id
            hideScrollbar
            disableColumnMenu
            autoHeight
            sx={{ px: { xs: 0, md: 1 } }}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            pageSizeOptions={[5, 10, 20]}
          />
        </Grid>
      </Grid>
      <IncomeExpensesConfirmDeleteEntryDialog
        {...{
          confirmDeleteEntryDialogOpen,
          setConfirmDeleteEntryDialogOpen,
          deleteEntryRow,
          setDeleteEntryRow,
          refreshData,
        }}
      />
    </>
  );
};

export default IncomeExpensesVisuals;
