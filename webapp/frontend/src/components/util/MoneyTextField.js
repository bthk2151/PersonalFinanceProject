import { InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";

// for Malaysian Ringgit currency input
const MoneyTextField = (props) => {
  const [value, setValue] = useState("");
  const handleValueChange = (e) => {
    const regex = /^\d*\.?\d{0,2}$/; // allow only numbers and up to 2 decimal places
    if (regex.test(e.target.value)) {
      setValue(e.target.value);
    }
  };
  const handleValueBlur = (e) =>
    setValue(parseFloat(e.target.value).toFixed(2));

  return (
    <TextField
      {...props}
      type="number"
      value={value}
      inputProps={{ min: "0" }}
      InputProps={{
        startAdornment: <InputAdornment position="start">RM</InputAdornment>,
      }}
      onChange={handleValueChange}
      onBlur={handleValueBlur} // blur is react equivalent of js onfocusout
    />
  );
};

export default MoneyTextField;
