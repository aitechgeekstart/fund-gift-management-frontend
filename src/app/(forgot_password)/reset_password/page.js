"use client";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
} from "@mui/material";
import { isArray } from "lodash";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useImmer } from "use-immer";
import {
  FormLabel,
  LoadingButton,
  TextField,
  Typography,
} from "/src/components/Global";
import { useAuth } from "/src/hooks/forgot_password/use-auth";

const defaultData = {
  password: "",
  password_confirmation: "",
};

export default function Page() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { fetcherWithToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [formData, setFormData] = useImmer(defaultData);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowPasswordConfirmation = () =>
    setShowPasswordConfirmation((show) => !show);

  const onFormChange = (value, key) => {
    setFormData((draft) => {
      draft[key] = value;
    });
  };

  const validateForm = () => {
    const keys = [
      {
        value: "password",
        label: "Password",
        required: true,
      },
      {
        value: "password_confirmation",
        label: "Password Confirmation",
        required: true,
      },
    ];
    let formError = {};
    keys.forEach((k) => {
      if (
        k.required &&
        (!formData[k.value] ||
          isArray(formData[k.value] && formData[k.value].length === 0))
      ) {
        formError[k.value] = `${k.label} cannot be blank`;
      }
    });
    setError(formError);
    return Object.keys(formError).length < 1;
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (validateForm()) {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");
      const allParams = JSON.stringify({
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        token: token,
      });
      const response = await fetcherWithToken(
        "api/v2/user/sessions/set_password",
        {
          method: "POST",
          body: allParams,
        },
      );

      if (response && response.success) {
        routerBack();
      } else {
        setErrorMessage(response.error);
      }
    } else {
      enqueueSnackbar("Please recheck all required fields.", {
        variant: "error",
      });
    }

    setLoading(false);
  };

  const routerBack = () => {
    window.location = "/login";
  };

  return (
    <Grid
      item
      xs={12}
      sm={10}
      md={7}
      lg={5}
      component={Paper}
      elevation={0}
      square={false}
      sx={{
        borderRadius: 2,
        border: "1px solid #e0e0e0",
      }}
    >
      <Box
        sx={{
          my: 8,
          mx: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <NextImage
          src={"/images/logo.png"}
          alt="Logo Image"
          height={160}
          width={160}
          style={{
            objectFit: "contain",
            alignSelf: "center",
          }}
        />
        <Typography
          variant="h4"
          sx={{
            alignSelf: "flex-start",
            mt: 2,
          }}
        >
          Set Password
        </Typography>
        <Typography
          variant="body2"
          color="grey"
          sx={{
            alignSelf: "flex-start",
            fontWeight: 400,
          }}
        >
          Please setup your password within the next 5 minutes.
        </Typography>
        <Box sx={{ mt: 4 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Grid
            container
            spacing={1}
            direction="row"
            justifyContent="space-between"
          >
            <Grid item xs={12}>
              <FormLabel required>Password</FormLabel>
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="disabled"
                name="password"
                helperText={error.password}
                error={!!error.password}
                value={formData.password || ""}
                onChange={(e) => onFormChange(e.target.value, "password")}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ mr: 1 }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 1, mb: 1 }}>
              <Typography variant="body2" color="grey" sx={{ fontWeight: 400 }}>
                Your password must follow these rules
                <ul style={{ margin: 0, padding: "0 23px" }}>
                  <li>At least 1 lowercase character</li>
                  <li>At least 1 uppercase character</li>
                  <li>At least 1 special character</li>
                  <li>At least 12 characters long</li>
                </ul>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormLabel required>Confirm Password</FormLabel>
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="disabled"
                name="password_confirmation"
                helperText={error.password_confirmation}
                error={!!error.password_confirmation}
                value={formData.password_confirmation || ""}
                onChange={(e) =>
                  onFormChange(e.target.value, "password_confirmation")
                }
                placeholder="Password Confirmation"
                type={showPasswordConfirmation ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPasswordConfirmation}
                        sx={{ mr: 1 }}
                      >
                        {showPasswordConfirmation ? (
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
          <Stack
            direction="column"
            spacing={2}
            sx={{
              mt: "30px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LoadingButton
              color="primary"
              variant="contained"
              loadingPosition="start"
              startIcon={<ArrowForwardIcon />}
              loading={loading}
              onClick={() => handleSubmit()}
            >
              Confirm Password
            </LoadingButton>
          </Stack>
        </Box>
      </Box>
    </Grid>
  );
}
