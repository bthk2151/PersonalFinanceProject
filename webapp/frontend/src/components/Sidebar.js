import React from "react";
import { Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";

const sidebarMinWidth = 260;
const sidebarWidth = "20%";

const Sidebar = ({ setMode }) => {
  return (
    <Drawer
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: sidebarWidth,
          minWidth: sidebarMinWidth,
        },
        flexShrink: 0,
        width: sidebarWidth,
        minWidth: sidebarMinWidth,
        display: { xs: "none", sm: "block" },
      }}
      variant="permanent"
      anchor="left"
    >
      <SidebarItems setMode={setMode} isComprehensive={true} />
    </Drawer>
  );
};

export default Sidebar;
