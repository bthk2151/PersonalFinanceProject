import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";

// custom react hook which returns an axios instance for authenticated requests
const useAuthAxios = () => {
  // custom react hook used as its only way for context to be accessible
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  const authAxios = axios.create();

  // intercept to check if access token is invalid or has expired
  authAxios.interceptors.request.use(async (request) => {
    if (!authTokens) return request; // if no authTokens, just proceed with the request which will result with an unauthorized response

    request.headers.Authorization = `Bearer ${authTokens.access}`; // add existing token to authorization header

    // refresh token if expired
    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs().diff(dayjs.unix(user.exp)) > 0; // current datetime is after expiry datetime
    if (isExpired) {
      // refresh auth tokens and use new tokens
      const response = await axios.post("/api/token/refresh", {
        refresh: authTokens.refresh,
      });

      localStorage.setItem("authTokens", JSON.stringify(response.data));
      request.headers.Authorization = `Bearer ${response.data.access}`;

      setAuthTokens(response.data);
      setUser(jwtDecode(response.data.access));
    }

    return request;
  });

  return authAxios;
};

export default useAuthAxios;
