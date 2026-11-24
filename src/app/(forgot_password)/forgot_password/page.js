"use client";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Alert, Box, Grid, Paper, Stack, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { isArray } from "lodash";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useImmer } from "use-immer";
import {
  Button,
  FormLabel,
  LoadingButton,
  OTPInput,
  Typography,
} from "/src/components/Global";
import { useAuth } from "/src/hooks/forgot_password/use-auth";

const defaultData = {
  email: "",
  otp: "",
  ref: "",
};

const CustomTextField = styled((props) => (
  <TextField autoComplete="off" fullWidth size="small" {...props} />
))(({ theme }) => ({
  margin: 0,
  fontSize: "14px",
  textarea: {
    color: theme.palette.contrastText.default,
    padding: "3px 8px !important",
  },
  input: {
    color: theme.palette.contrastText.default,
    padding: "5px 10px !important",
  },
  ".Mui-disabled": {
    backgroundColor: "white",
    borderColor: "white",
  },
  ".MuiTextField": {
    "& .MuiFormHelperText-root": {
      backgroundColor: "unset",
    },
  },
  ".MuiInputBase-root": {
    padding: 0,
  },
}));

export default function Page() {
  const router = useRouter();
  const { fetcherWithToken } = useAuth(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useImmer(defaultData);
  const [hasOtp, setHasOtp] = useState(false);
  const [error, setError] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const onFormChange = (value, key) => {
    setFormData((draft) => {
      draft[key] = value;
    });
  };

  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setCountdown(0);
    }, 60000);
  };

  // useEffect(() => {
  //   if (countdown === 0) {
  //     setHasOtp(false); // ปิดการกรอก OTP เมื่อนับถอยหลังเสร็จสิ้น
  //   }
  // }, [countdown]);

  const validateForm = () => {
    const keys = [
      {
        value: "email",
        label: "Email",
        required: !hasOtp,
      },
      {
        value: "otp",
        label: "OTP",
        required: hasOtp,
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
    if (hasOtp && formData.otp.length !== 6) {
      setErrorMessage("Please input OTP");
      formError["otp"] = "Please input OTP";
    }
    setError(formError);
    return Object.keys(formError).length < 1;
  };

  const forgotPassword = async () => {
    setLoading(true);
    if (countdown === 0) {
      if (validateForm()) {
        startCountdown();
        const allParams = JSON.stringify({ user: { email: formData.email } });
        const response = await fetcherWithToken(
          "api/v2/user/sessions/forgot_password",
          {
            method: "POST",
            body: allParams,
          },
        );

        if (response && response.success) {
          onFormChange(response.ref, "ref");
          setHasOtp(true);
          setLoading(false);
        } else {
          setErrorMessage(response.error);
          setLoading(false);
        }
      } else {
        enqueueSnackbar("Please recheck all required fields.", {
          variant: "error",
        });
        setLoading(false);
      }
    } else {
      setErrorMessage(`Please wait for ${countdown} seconds.`);
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    if (validateForm()) {
      const allParams = JSON.stringify({
        user: { email: formData.email },
        otp: formData.otp,
      });
      const response = await fetcherWithToken(
        "api/v2/user/sessions/verify_otp",
        {
          method: "POST",
          body: allParams,
        },
      );

      if (response && response.success) {
        router.push(`/reset_password?token=${response.token}`);
      } else {
        setErrorMessage(response.error);
        setLoading(false);
      }
    } else {
      enqueueSnackbar("Please recheck all required fields.", {
        variant: "error",
      });
      setLoading(false);
    }
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
      {hasOtp ? (
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
            Verify Your OTP
          </Typography>
          <Typography
            variant="body2"
            color="grey"
            sx={{
              alignSelf: "flex-start",
              fontWeight: 400,
            }}
          >
            We've sent a verification code to your email. Enter it below to
            continue.
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
              <Grid item xs={6}>
                <FormLabel>Email : {formData.email}</FormLabel>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "right" }}>
                <FormLabel>OTP REF : {formData.ref}</FormLabel>
              </Grid>
              <Grid item xs={12}>
                <OTPInput onChange={(value) => onFormChange(value, "otp")} />
              </Grid>
            </Grid>
          </Box>
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
              fullWidth
              color="primary"
              variant="contained"
              startIcon={<ArrowForwardIcon />}
              onClick={() => verifyOtp()}
              loading={loading}
            >
              Submit
            </LoadingButton>

            <LoadingButton
              fullWidth
              color="primary"
              variant="outlined"
              disabled={countdown > 0}
              onClick={() => forgotPassword()}
            >
              {countdown === 0 ? "Re-Send" : `Re-Send [${countdown}]`}
            </LoadingButton>

            <Button
              fullWidth
              variant="text"
              color="grey"
              onClick={() => routerBack()}
            >
              Back to login
            </Button>
          </Stack>
        </Box>
      ) : (
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
            Forgot Password
          </Typography>
          <Typography
            variant="body2"
            color="grey"
            sx={{
              alignSelf: "flex-start",
              fontWeight: 400,
            }}
          >
            Please enter email to keep process.
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
                <FormLabel required>Email</FormLabel>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  disabled={hasOtp}
                  helperText={error.email}
                  error={!!error.email}
                  value={formData.email || ""}
                  onChange={(e) => onFormChange(e.target.value, "email")}
                  autoFocus
                  placeholder="Email"
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
                fullWidth
                color="primary"
                variant="contained"
                startIcon={<ArrowForwardIcon />}
                loading={loading}
                disabled={countdown > 0}
                onClick={() => forgotPassword()}
              >
                {countdown === 0 ? "Submit" : `Submit [${countdown}]`}
              </LoadingButton>

              <Button
                fullWidth
                variant="text"
                color="grey"
                onClick={() => routerBack()}
              >
                Back to login
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
    </Grid>
  );
}
