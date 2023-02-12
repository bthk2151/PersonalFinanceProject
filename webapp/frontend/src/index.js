import React from "react";
import App from "./components/App";
import { createRoot } from "react-dom/client";

const app = $("#app")[0];
const root = createRoot(app);

root.render(<App />);
