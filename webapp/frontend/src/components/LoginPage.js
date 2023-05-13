import { Login } from "@mui/icons-material";
import {
  Alert,
  Button,
  Collapse,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import jwtDecode from "jwt-decode";
import GridBox from "./utils/GridBox";

const LoginPage = () => {
  const { user, setAuthTokens, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // to store field respective error messages, if error exists
  const [fieldValidationErrors, setFieldValidationErrors] = useState(null);

  const [loginError, setLoginError] = useState(null);

  const handleSubmit = (e) => {
    // login user
    e.preventDefault();

    // validate and show error messages, if any field is invalid
    const errors = {
      username: !Boolean(username.trim()) ? "Username is required" : null,
      password: !Boolean(password.trim()) ? "Password is required" : null,
    };

    setFieldValidationErrors(errors);

    // proceed only if all fields are valid (all error message are null)
    if (!Object.values(errors).every((value) => value === null)) return;

    axios
      .post("/api/token", {
        username: username,
        password: password,
      })
      .then((response) => {
        setAuthTokens(response.data);
        setUser(jwtDecode(response.data.access));

        localStorage.setItem("authTokens", JSON.stringify(response.data));

        navigate("/income-expenses");
      })
      .catch((error) => {
        setLoginError(
          error.response.status === 401
            ? "Invalid username or password"
            : error.message
        );
      });
  };

  if (user) return <Navigate to="/income-expenses" replace />;

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Login</Typography>
        </Grid>
        <Grid item xs={12} md={4} paddingRight={{ xs: 0, md: 1 }}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            helperText={fieldValidationErrors?.username}
            error={Boolean(fieldValidationErrors?.username)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={4} paddingRight={{ xs: 0, md: 1 }}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            helperText={fieldValidationErrors?.password}
            error={Boolean(fieldValidationErrors?.password)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Tooltip title="Login">
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<Login />}
              sx={{ width: { xs: "100%", md: "auto" } }}
            >
              Login
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sx={{ mt: { xs: 0, md: -1 } }}>
          <GridBox justifyContent={{ xs: "flex-end", md: "flex-start" }}>
            <Typography variant="caption">
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "inherit" }}>
                Register!
              </Link>
            </Typography>
          </GridBox>
        </Grid>
        <Grid item xs={12} md={8}>
          <Collapse
            in={loginError !== null}
            timeout={{ enter: 250, exit: 0 }} // entrance take 0.25 seconds, exit is instant
          >
            <Alert
              severity="error" // for icon
              variant="outlined"
              onClose={() => setLoginError(null)}
            >
              {loginError}
            </Alert>
          </Collapse>
        </Grid>
      </Grid>
    </form>
  );
};

export default LoginPage;
