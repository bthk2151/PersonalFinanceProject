import React from "react";
import { createContext, useState } from "react";

// this action context will be used to handle all user action code that are shared across multiple components
const ActionContext = createContext();

export default ActionContext;

export const ActionProvider = ({ children }) => {
  const [loadingInProgress, setLoadingInProgress] = useState(false);

  const contextData = {
    ...{ loadingInProgress, setLoadingInProgress },
  };

  return (
    <ActionContext.Provider value={contextData}>
      {children}
    </ActionContext.Provider>
  );
};
