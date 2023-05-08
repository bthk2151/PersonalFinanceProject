import { Login } from "@mui/icons-material";
import { Button, Grid, TextField, Tooltip, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import GridBox from "./utils/GridBox";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import jwtDecode from "jwt-decode";

const LoginPage = () => {
  const { user, setAuthTokens, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    // login user
    e.preventDefault();

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
        alert(error.response.data.detail);
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
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <GridBox justifyContent={{ xs: "flex-end", md: "flex-start" }}>
            <Tooltip title="Login">
              <Button type="submit" variant="contained" size="large">
                <Login />
              </Button>
            </Tooltip>
          </GridBox>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption">
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "inherit" }}>
              Register!
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </form>
  );
};

export default LoginPage;
