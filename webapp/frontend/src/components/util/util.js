import dayjs from "dayjs";
import { colors } from "@mui/material";

// all util js functions to reduce redundancy

// capitalize first letter of each word in string, intended for text fields
export const capitalizeWords = (str) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// convert int day_of_week to short form day name
// note: day_of_week value for income expense entries are derived from using Python datetime.fromisoformat().weekday()
export const intDayToShortDay = (int) =>
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][int];

// format amount in currency string format (include RM prefix)
const currencyFormatter = new Intl.NumberFormat("ms-MY", {
  style: "currency",
  currency: "MYR",
});
export const formatCurrency = (amount) => currencyFormatter.format(amount);

// consistent date format throughout the app, DD/MM/YYYY, as all formats should be intuitively (smallest to biggest)
export const formatDate = (date, isShortForm = false) =>
  dayjs(date).format(!isShortForm ? "DD/MM/YYYY" : "DD/MM");

// app has generally 2 main layouts, one for small and one for regular screens
// using window.matchMedia() instead of MUI useMediaQuery() hook, latter seems clunky to define at each component
export const isSmallScreen = () =>
  !window.matchMedia("(min-width: 900px)").matches;

// general app colors are MUI success for positive elements and MUI error for negative elements
// more specific app colors can be accessed below
export const getThemeColors = () => ({
  positive: colors.green[500], // MUI success color hex code
  positiveStrong: colors.green[900],
  negative: colors.red[500], // MUI error color hex code
  negativeStrong: colors.red[900],
});
