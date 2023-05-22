import { Info, PersonAdd } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import GridBox from "./utils/GridBox";
import { capitalizeWords, isValidEmail } from "../utils/js-utils";
import axios from "axios";

const commonTextFieldProps = {
  fullWidth: true,
  InputLabelProps: { shrink: true },
  autoComplete: "new-password",
};

const RegisterPage = () => {
  // setLoadingInProgress(true | false) will respectively show or hide backdrop with spinner
  const { setLoadingInProgress } = useContext(ActionContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [eodhdApiKey, setEodhdApiKey] = useState("");

  const [fieldValidationErrors, setFieldValidationErrors] = useState(null);
  // used when a user registration is successful / unsuccessful, to display alert
  const [registerStatus, setRegisterStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // helper function used below to reduce code at validation, since similar
    const passwordValidation = (pw) =>
      !Boolean(pw.trim())
        ? "Password is required"
        : pw.length < 8
        ? "Password too short"
        : pw.length > 200
        ? "Password too long"
        : password !== confirmPassword
        ? "Passwords do not match"
        : null;

    // validate and show error messages, if any field is invalid
    const errors = {
      firstName: !Boolean(firstName.trim())
        ? "First name is required"
        : firstName.length > 200
        ? "First name too long"
        : null,
      lastName: !Boolean(lastName.trim())
        ? "Last name is required"
        : lastName.length > 200
        ? "Last name too long"
        : null,
      email: !Boolean(email.trim())
        ? "Email is required"
        : !isValidEmail(email.trim())
        ? "Email is invalid"
        : email.length > 200
        ? "Email too long"
        : null,
      username: !Boolean(username.trim())
        ? "Username is required"
        : username.length > 200
        ? "Username too long"
        : null,
      password: passwordValidation(password),
      confirmPassword: passwordValidation(confirmPassword),
    };

    setFieldValidationErrors(errors);

    // proceed only if all fields are valid (all error message are null)
    if (!Object.values(errors).every((value) => value === null)) return;

    // freeze the page and show the loading spinner, sending account activation SMTP email may take several seconds
    setLoadingInProgress(true);

    axios
      .post("/api/create-user", {
        first_name: firstName,
        last_name: lastName,
        email: email,
        username: username,
        password: password,
        profile: { eodhd_api_token: eodhdApiKey },
      })
      .then((response) => {
        setRegisterStatus({
          isSuccess: true,
          message:
            "Your account has been created successfully, we have sent an email containing a verification link to the address above. To ensure the security of your account, email verification is required before being able to login.",
        });
      })
      .catch((error) => {
        setRegisterStatus({
          isSuccess: false,
          // following json api error format: if there is a code, there should be a detail key as well
          message: error.response?.data?.code
            ? error.response.data.detail
            : error.message,
        });

        if (error.response?.data?.meta) {
          // make sure the field validation errors are indicative
          const errors = {
            username:
              error.response.data.meta.username_exists === "True" // have to consider that meta items are in python bool format
                ? "Username already exists"
                : null,
            email:
              error.response.data.meta.email_exists === "True"
                ? "Email already exists"
                : null,
          };
          setFieldValidationErrors(errors);
        }
      })
      .finally(() => setLoadingInProgress(false)); // dismiss spinner, unfreeze the page
  };

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="new-password">
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Register</Typography>
        </Grid>
        <Grid item xs={6} md={4} paddingRight={1}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => {
              setFirstName(capitalizeWords(e.target.value));
            }}
            placeholder="Bryan"
            helperText={fieldValidationErrors?.firstName}
            error={Boolean(fieldValidationErrors?.firstName)}
            {...commonTextFieldProps}
          />
        </Grid>
        <Grid item xs={6} md={4} paddingRight={{ xs: 0, md: 1 }}>
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => {
              setLastName(capitalizeWords(e.target.value));
            }}
            placeholder="Tan"
            helperText={fieldValidationErrors?.lastName}
            error={Boolean(fieldValidationErrors?.lastName)}
            {...commonTextFieldProps}
          />
        </Grid>
        <Grid item xs={0} md={4}></Grid>
        <Grid item xs={12} md={8} paddingRight={{ xs: 0, md: 1 }}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="bthk2151.pfp@gmail.com"
            helperText={fieldValidationErrors?.email}
            error={Boolean(fieldValidationErrors?.email)}
            {...commonTextFieldProps}
          />
        </Grid>
        <Grid item xs={0} md={4}></Grid>
        <Grid item xs={12} md={4} paddingRight={{ xs: 0, md: 1 }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="bthk2151"
            helperText={fieldValidationErrors?.username}
            error={Boolean(fieldValidationErrors?.username)}
            {...commonTextFieldProps}
          />
        </Grid>
        <Grid item xs={12} md={4} paddingRight={{ xs: 0, md: 1 }}>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="●●●●●●●●●●●●"
            helperText={fieldValidationErrors?.password}
            error={Boolean(fieldValidationErrors?.password)}
            {...commonTextFieldProps}
          />
        </Grid>
        <Grid item xs={0} md={4}></Grid>
        <Grid item xs={0} md={4}></Grid>
        <Grid item xs={12} md={4} paddingRight={{ xs: 0, md: 1 }}>
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            placeholder="●●●●●●●●●●●●"
            helperText={fieldValidationErrors?.confirmPassword}
            error={Boolean(fieldValidationErrors?.confirmPassword)}
            {...commonTextFieldProps}
          />
        </Grid>
      </Grid>
      <Divider sx={{ marginY: 3 }} />
      <Grid container rowSpacing={2}>
        <Grid item xs={12} md={8} paddingRight={{ xs: 0, md: 1 }}>
          <TextField
            label={
              <Box component="span">
                EOD Historical Data API Key{" "}
                <Box component="span" sx={{ fontStyle: "italic" }}>
                  (optional)
                </Box>
              </Box>
            }
            value={eodhdApiKey}
            onChange={(e) => {
              setEodhdApiKey(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ cursor: "pointer" }}>
                  <Tooltip
                    title={
                      <Typography>
                        Register for an EOD Historical Data API key if you want
                        to access financial data for the{" "}
                        <Box component="span" sx={{ fontStyle: "italic" }}>
                          Assets & Liabilities
                        </Box>{" "}
                        module of the application
                      </Typography>
                    }
                    enterTouchDelay={0}
                  >
                    <Info />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            {...commonTextFieldProps}
          />
        </Grid>
        <Grid item xs={0} md={4}></Grid>
        <Grid item xs={12} md={8} paddingRight={{ xs: 0, md: 1 }}>
          <GridBox justifyContent={{ xs: "flex-start", md: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<PersonAdd />}
              sx={{ width: { xs: "100%", md: "auto" } }}
            >
              Register
            </Button>
          </GridBox>
        </Grid>
        <Grid item xs={0} md={4}></Grid>
        <Grid item xs={12} md={8}>
          <Collapse
            in={registerStatus !== null}
            timeout={{ enter: 250, exit: 0 }} // entrance take 0.25 seconds, exit is instant
          >
            <Alert
              severity={registerStatus?.isSuccess ? "success" : "error"}
              variant="outlined"
              onClose={() => setRegisterStatus(null)}
            >
              {registerStatus?.message}
            </Alert>
          </Collapse>
        </Grid>
      </Grid>
    </form>
  );
};

export default RegisterPage;
