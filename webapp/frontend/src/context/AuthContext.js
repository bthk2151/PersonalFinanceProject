import jwtDecode from "jwt-decode";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

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

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);

    localStorage.removeItem("authTokens");

    navigate("/");
  };

  // ensure the case when authTokens are refreshed, the user data is updated as well
  useEffect(() => {
    if (authTokens) setUser(jwtDecode(authTokens.access));
  }, [authTokens]);

  const contextData = {
    ...{ authTokens, user, setAuthTokens, setUser, logoutUser },
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
