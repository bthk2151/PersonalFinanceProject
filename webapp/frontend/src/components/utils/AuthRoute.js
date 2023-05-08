import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

// to wrap pages which require auth
const AuthRoute = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/" replace />; // to always throw user to root login page when no user state: unauthenticated

  return <Outlet />; // for rendering child routes within a parent route, only when authenticated
};

export default AuthRoute;
