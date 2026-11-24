"use client";
import { CssBaseline, Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "/src/config/theme";
import { AuthProvider } from "/src/hooks/forgot_password/use-auth";
import ApplicationConfigProvider from "/src/hooks/use-application-config";

export default function Layout({ children }) {
  return (
    <ApplicationConfigProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Grid
            container
            component="main"
            sx={{ height: "100vh", alignItems: "center" }}
            justifyContent="center"
          >
            <CssBaseline />
            {children}
          </Grid>
        </ThemeProvider>
      </AuthProvider>
    </ApplicationConfigProvider>
  );
}
