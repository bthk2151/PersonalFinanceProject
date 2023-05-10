import { AppBar, IconButton, Toolbar, Box, Typography } from "@mui/material";
import React, { useContext } from "react";
import { Login, Logout, Menu } from "@mui/icons-material";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Topbar = ({ setMobileSidebarOpen }) => {
  const { user, logoutUser } = useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <AppBar position="sticky" color="default">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={() => setMobileSidebarOpen(true)}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <Menu sx={{ color: "default" }} />
        </IconButton>

        {user ? (
          <Box
            p={2}
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: { xs: "center", md: "normal" },
              gap: 2,
            }}
          >
            <Typography variant="subtitle1">{user.first_name}</Typography>
            <IconButton onClick={logoutUser}>
              <Logout />
            </IconButton>
          </Box>
        ) : (
          <IconButton onClick={() => navigate("/")}>
            <Login />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
