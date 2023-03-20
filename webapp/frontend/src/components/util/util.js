import React from "react";

// all util js functions to reduce redundancy

// capitalize first letter of each word in string, ideally for text fields
export const capitalizeWords = (str) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
