"use client";
import { CssBaseline, Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "/src/config/theme";
import ApplicationConfigProvider from "/src/hooks/use-application-config";
import { AuthProvider } from "/src/hooks/use-auth";

export default function Layout({ children }) {
  return (
    <ApplicationConfigProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Grid container component="main" sx={{ height: "100vh" }}>
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage: "url('/images/sign_in_cover.jpg')",
                backgroundRepeat: "no-repeat",
                backgroundColor: (t) =>
                  t.palette.mode === "light"
                    ? t.palette.grey[200]
                    : t.palette.grey[900],
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {children}
          </Grid>
        </ThemeProvider>
      </AuthProvider>
    </ApplicationConfigProvider>
  );
}
