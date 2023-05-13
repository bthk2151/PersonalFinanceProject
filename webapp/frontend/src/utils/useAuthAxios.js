import { useContext, useMemo } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";

// custom hook which returns an axios instance for authenticated requests
const useAuthAxios = () => {
  const { authTokens, setUser, setAuthTokens, logoutUser } =
    useContext(AuthContext);

  // memoize authAxios instance to improve performance
  const authAxios = useMemo(() => {
    const axiosInstance = axios.create();

    // intercept requests to attach access tokens
    axiosInstance.interceptors.request.use(async (request) => {
      // if no authTokens, force logout user
      if (!authTokens) {
        logoutUser();
        return request;
      }

      // check if expired
      const user = jwtDecode(authTokens.access);
      const isExpired = dayjs().diff(dayjs.unix(user.exp)) > 0; // current datetime is after expiry datetime

      // if current authTokens are still valid, proceed with request
      if (!isExpired) {
        request.headers.Authorization = `Bearer ${authTokens.access}`;
        return request;
      }

      // check if a refresh request is in progress
      if (!useAuthAxios.isRefreshingToken) {
        // only this single request is sent to refresh token
        useAuthAxios.isRefreshingToken = true;

        try {
          // refresh auth tokens and save new tokens
          const response = await axios.post("/api/token/refresh", {
            refresh: authTokens.refresh,
          });

          localStorage.setItem("authTokens", JSON.stringify(response.data));
          request.headers.Authorization = `Bearer ${response.data.access}`;

          setAuthTokens(response.data);
          setUser(jwtDecode(response.data.access));
        } catch (error) {
          // if attempt to refresh with invalid / expired refresh token, force logout user
          if (error.response?.data?.code === "token_not_valid") logoutUser();
          else console.log(error.message);
        } finally {
          useAuthAxios.isRefreshingToken = false;
        }
      } else {
        // wait for the current refresh request to complete
        await new Promise((resolve) => {
          const interval = setInterval(() => {
            // check every 0.1 seconds
            if (!useAuthAxios.isRefreshingToken) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });

        // once refresh request completes, authTokens in localStorage are updated and ready to use
        // note: MUST use authTokens in localStorage, as during this execution thread, authTokens stored in the state still references the old, expired token
        request.headers.Authorization = `Bearer ${
          JSON.parse(localStorage.getItem("authTokens")).access
        }`;
      }

      return request;
    });

    return axiosInstance;
  }, [authTokens]);

  return authAxios;
};

// flag to ensure only a single refresh request can be done at a time
// has to be a static variable with a consistent value across all useAuthAxios instances
useAuthAxios.isRefreshingToken = false;

export default useAuthAxios;
