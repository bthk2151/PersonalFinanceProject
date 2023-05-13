import React, { useContext } from "react";
import {
  Box,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Switch,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  SportsScore,
  AccountBalance,
  CreditCard,
  DarkMode,
  Logout,
  Login,
  PersonAdd,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const unauthPages = [
  { name: "Login", icon: <Login />, urlPath: "/" },
  {
    name: "Register",
    icon: <PersonAdd />,
    urlPath: "/register",
  },
];

const authPages = [
  { name: "Financial Goal", icon: <SportsScore />, urlPath: "/financial-goal" },
  {
    name: "Assets & Liabilities",
    icon: <AccountBalance />,
    urlPath: "/assets-liabilities",
  },
  {
    name: "Income & Expenses",
    icon: <CreditCard />,
    urlPath: "/income-expenses",
  },
];

const renderListItem = (page) => (
  <ListItem key={page.name} disablePadding>
    <ListItemButton component={Link} to={page.urlPath}>
      <ListItemIcon>{page.icon}</ListItemIcon>
      <ListItemText primary={page.name} />
    </ListItemButton>
  </ListItem>
);

const SidebarItems = ({ mode, setMode, isComprehensive }) => {
  const { user, logoutUser } = useContext(AuthContext);

  const now = new Date();
  const greeting =
    now.getHours() >= 4 && now.getHours() < 12
      ? "Good Morning"
      : now.getHours() >= 12 && now.getHours() < 18
      ? "Good Afternoon"
      : "Good Evening";

  const handleModeChange = (e) => {
    const selectedMode = e.target.checked ? "dark" : "light";

    setMode(selectedMode);
    localStorage.setItem("mode", selectedMode);
  };

  return (
    <>
      <Toolbar />
      <Divider />
      {isComprehensive && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box p={2}>
              <Typography>{greeting},</Typography>
              <Typography variant="h6">
                {user ? user.first_name : "Stranger"}
              </Typography>
            </Box>
            <Box p={2} sx={{ display: "flex", alignItems: "center" }}>
              {user && (
                <Tooltip title="Logout">
                  <IconButton onClick={logoutUser}>
                    <Logout />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
          <Divider />
        </>
      )}
      <List>
        {user ? authPages.map(renderListItem) : unauthPages.map(renderListItem)}
      </List>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <DarkMode />
          </ListItemIcon>
          <ListItemText>
            <Switch onChange={handleModeChange} checked={mode === "dark"} />
          </ListItemText>
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  );
};

export default SidebarItems;
