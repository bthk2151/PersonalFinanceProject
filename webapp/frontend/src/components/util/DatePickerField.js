import { DatePicker } from "@mui/x-date-pickers";
import React from "react";

// global app setup for date input field
const DatePickerField = (props) => {
  return (
    <DatePicker {...props} showDaysOutsideCurrentMonth format="DD/MM/YYYY" />
  );
};

export default DatePickerField;
