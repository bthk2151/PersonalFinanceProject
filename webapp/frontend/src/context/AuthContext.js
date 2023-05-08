import jwtDecode from "jwt-decode";
import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(JSON.parse(localStorage.getItem("authTokens")).access)
      : null
  );

  // ensure the case when authTokens are refreshed, the user data is updated as well
  useEffect(() => {
    if (authTokens) setUser(jwtDecode(authTokens.access));
  }, [authTokens]);

  const contextData = { ...{ authTokens, user, setAuthTokens, setUser } };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
