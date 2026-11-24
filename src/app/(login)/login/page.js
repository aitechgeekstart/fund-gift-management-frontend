"use client";
import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Typography,
} from "@mui/material";
import NextImage from "next/image";
import { useState } from "react";
import { useImmer } from "use-immer";
import {
  FormLabel,
  LegacyNextLink,
  LoadingButton,
  TextField,
} from "/src/components/Global";
import { useAuth } from "/src/hooks/use-auth";

const loginParams = {
  email: "",
  password: "",
  showPassword: false,
};

const defaultOtpData = {
  otp: "",
  jwt: "",
  otp_reference_code: "",
  redirect_to_otp: false,
  remember: false,
};

export default function Page() {
  const auth = useAuth();
  const [otpData, setOtpData] = useImmer(defaultOtpData);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useImmer(loginParams);
  const [error, setError] = useImmer({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  if (auth.authStatus === "yes") {
    window.location = `/auth`;
    return <></>;
  }

  const handleClickShowPassword = () => {
    setLoginForm({
      ...loginForm,
      showPassword: !loginForm.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onFormChange = (prop) => (e) => {
    setLoginForm((draft) => {
      draft[prop] = e.target.value;
    });
  };

  const onOtpDataChange = (key, value) => {
    setOtpData((draft) => {
      draft[key] = value;
    });
  };

  const validateForm = () => {
    const keys = [
      {
        value: "email",
        label: "Email",
      },
      {
        value: "password",
        label: "Password",
      },
    ];
    let formError = {};
    keys.forEach((k) => {
      if (!loginForm[k.value]) {
        formError[k.value] = `${k.label} cannot be blank.`;
      }
    });
    setError(formError);
    return Object.keys(formError).length < 1;
  };

  const backToSignIn = () => {
    setOtpData(defaultOtpData);
  };

  const handleLogin = async () => {
    setErrorMessage("");
    if (validateForm()) {
      setLoading(true);
      const token = localStorage.getItem("deviceToken") || "";
      const json = await auth.loginV2(
        loginForm.email,
        loginForm.password,
        token,
      );
      if (json?.response.status === 201) {
        if (json.redirect_to_otp) {
          setOtpData((draft) => {
            draft["jwt"] = json.jwt;
            draft["otp_reference_code"] = json.otp_reference_code;
            draft["redirect_to_otp"] = json.redirect_to_otp;
          });
        } else {
          window.location = "/auth";
        }
      } else if (json.error) {
        setErrorMessage(json.error);
      } else if (json.error_code) {
        setErrorMessage(`${json.error_code} - ${json.error_message}`);
      }
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMessage("");
    if (validateForm()) {
      setLoading(true);
      const json = await auth.verifyOtp(otpData.jwt, otpData.otp);
      if (json?.response.status === 201) {
        if (otpData.remember) {
          localStorage.setItem("deviceToken", json.device_jwt);
        }

        window.location = "/auth";
      } else if (json.error) {
        setErrorMessage(json.error);
      } else if (json.error_code) {
        setErrorMessage(`${json.error_code} - ${json.error_message}`);
      }
      setLoading(false);
    }
  };

  return (
    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
      <Box
        sx={{
          my: 8,
          mx: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <NextImage
          src={"/images/logo.png"}
          alt="Logo Image"
          height={160}
          width={160}
          objectFit="contain"
        />
        <br />
        {!otpData.redirect_to_otp ? (
          <>
            <Typography component="h2" variant="h6">
              Sign in
            </Typography>
            <Box sx={{ mt: 1 }}>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              <Grid container>
                <Grid item xs={12}>
                  <FormLabel required>Email</FormLabel>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    value={loginForm.email}
                    onChange={onFormChange("email")}
                    onKeyPress={(e) => {
                      if (e.code === "Enter" || e.code === "NumpadEnter") {
                        handleLogin(e);
                      }
                    }}
                    error={!!error.email}
                    helperText={error.email}
                    autoFocus
                    autoComplete="off"
                    placeholder="Email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormLabel required>Password</FormLabel>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    value={loginForm.password}
                    onChange={onFormChange("password")}
                    onKeyPress={(e) => {
                      if (e.code === "Enter" || e.code === "NumpadEnter") {
                        handleLogin(e);
                      }
                    }}
                    type={loginForm.showPassword ? "text" : "password"}
                    error={!!error.password}
                    helperText={error.password}
                    autoComplete="off"
                    placeholder="Password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle current password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            sx={{ mr: 1 }}
                          >
                            {loginForm.showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <LoadingButton
                type="submit"
                fullWidth
                onClick={handleLogin}
                disabled={
                  !(loginForm.email.length > 0 && loginForm.password.length > 0)
                }
                loading={loading}
                loadingPosition="start"
                startIcon={<LoginIcon />}
                variant="contained"
                sx={{ my: 1 }}
              >
                SIGN IN
              </LoadingButton>

              <Grid
                container
                justifyContent={{ xs: "start", sm: "start", md: "end" }}
              >
                <LegacyNextLink href="/forgot_password">
                  FORGOT PASSWORD
                </LegacyNextLink>
              </Grid>
            </Box>
          </>
        ) : (
          <>
            <Typography component="h2" variant="h6">
              OTP Login
            </Typography>
            <Box sx={{ mt: 1 }}>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              <Grid container>
                <Grid item xs={12}>
                  <FormLabel required>OTP</FormLabel>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="primary" variant="caption">
                    REF : {otpData.otp_reference_code}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    value={otpData.otp}
                    onChange={(e) => onOtpDataChange("otp", e.target.value)}
                    onKeyPress={(e) => {
                      if (e.code === "Enter" || e.code === "NumpadEnter") {
                        handleVerifyOtp(e);
                      }
                    }}
                    error={!!error.otp}
                    helperText={error.otp}
                    autoFocus
                    autoComplete="off"
                    placeholder="OTP"
                  />
                </Grid>
                <Grid item xs={12} pt={1}>
                  <FormControlLabel
                    sx={{
                      margin: 0,
                      alignItems: "flex-start",
                    }}
                    label="Remember 30 days"
                    control={
                      <Checkbox
                        sx={{ padding: 0 }}
                        checked={otpData.remember}
                        onChange={(checked) =>
                          onOtpDataChange("remember", checked.target.checked)
                        }
                      />
                    }
                  />
                </Grid>
              </Grid>

              <LoadingButton
                type="submit"
                fullWidth
                onClick={handleVerifyOtp}
                disabled={!(otpData.otp.length > 0)}
                loading={loading}
                loadingPosition="start"
                startIcon={<LoginIcon />}
                variant="contained"
                sx={{ my: 1 }}
              >
                VERIFY
              </LoadingButton>

              <Grid
                container
                justifyContent={{ xs: "start", sm: "start", md: "end" }}
              >
                <LegacyNextLink href="#" onClick={backToSignIn}>
                  BACK TO SIGN IN
                </LegacyNextLink>
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </Grid>
  );
}
