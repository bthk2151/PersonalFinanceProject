import React, { useState } from "react";
import ErrorPage from "./ErrorPage";
import { Link, useSearchParams } from "react-router-dom";
import { Alert, Box, Button, Collapse, Stack, Typography } from "@mui/material";
import axios from "axios";

const ActivationPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const token = searchParams.get("token");
  // if status query param contains one of these values, show the page, else show 404 page
  const isValidStatus = ["success", "activated", "expired", "invalid"].includes(
    status
  );

  // setLoadingInProgress(true | false) will respectively show or hide backdrop with spinner
  const { setLoadingInProgress } = useContext(ActionContext);

  const [resendVerificationStatus, setResendVerificationStatus] =
    useState(null);

  const handleResendVerification = () => {
    setLoadingInProgress(true);

    axios
      .post("/api/resend-verification-link", {
        expired_token: token,
      })
      .then((response) => {
        setResendVerificationStatus({
          isSuccess: true,
          message: "A new verification link has been sent successfully.",
        });
      })
      .catch((error) => {
        setResendVerificationStatus({
          isSuccess: false,
          // following json api error format: if there is a code, there should be a detail key as well
          message: error.response?.data?.code
            ? error.response.data.detail
            : error.message,
        });
      })
      .finally(() => setLoadingInProgress(false)); // dismiss spinner, unfreeze the page
  };

  const getGreeting = () => {
    switch (status) {
      case "success":
        return (
          <Typography variant="h6" color="success.main">
            Congratulations!
          </Typography>
        );
      case "activated":
        return <Typography variant="h6">Account already verified</Typography>;
      case "expired":
        return (
          <Typography variant="h6" color="error">
            Verification link already expired
          </Typography>
        );
      default:
        return (
          <Typography variant="h6" color="error">
            Something went wrong
          </Typography>
        );
    }
  };

  const getMessage = () => {
    switch (status) {
      case "success":
        return (
          <Typography variant="body1">
            Your account has been successfully verified. You may now proceed to
            login using your username and password{" "}
            <Link to="/" style={{ color: "inherit" }}>
              here
            </Link>
            .
          </Typography>
        );
      case "activated":
        return (
          <Typography variant="body1">
            Your account has already been verified. Please login using your
            username and password{" "}
            <Link to="/" style={{ color: "inherit" }}>
              here
            </Link>
            .
          </Typography>
        );
      case "expired":
        return (
          <Typography variant="body1">
            The verification link previously sent to your email address has
            expired. To receive a new verification link and activate your
            account, please click the button below.
          </Typography>
        );
      default:
        return (
          <Typography variant="body1">
            Invalid account verification link.
          </Typography>
        );
    }
  };

  return isValidStatus ? (
    <Box component="div">
      <Stack spacing={2} alignItems="start">
        {getGreeting()}
        {getMessage()}
        {status === "expired" && (
          // only if verification token has expired, display resend verification link button
          <Button
            variant="outlined"
            sx={{ width: { xs: "100%", md: "auto" } }}
            color="inherit"
            onClick={handleResendVerification}
          >
            Resend Verification Link
          </Button>
        )}
        <Collapse
          in={resendVerificationStatus !== null}
          timeout={{ enter: 250, exit: 0 }} // entrance take 0.25 seconds, exit is instant
          sx={{ width: { xs: "100%", md: "auto" } }}
        >
          <Alert
            severity={resendVerificationStatus?.isSuccess ? "success" : "error"}
            variant="outlined"
            onClose={() => setResendVerificationStatus(null)}
          >
            {resendVerificationStatus?.message}
          </Alert>
        </Collapse>
      </Stack>
    </Box>
  ) : (
    <ErrorPage />
  );
};

export default ActivationPage;
