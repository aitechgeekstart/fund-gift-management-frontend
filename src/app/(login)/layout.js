"use client";
import MUIThemeProvider from "@/components/ThemeProvider";
import ApplicationConfigProvider from "@/hooks/use-application-config";
import { AuthProvider } from "@/hooks/use-auth";
import { Grid } from "@mui/material";

export default function Layout({ children }) {
  return (
    <ApplicationConfigProvider>
      <AuthProvider>
        <Grid container component="main" sx={{ height: "100vh" }}>
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
          <MUIThemeProvider>{children}</MUIThemeProvider>
        </Grid>
      </AuthProvider>
    </ApplicationConfigProvider>
  );
}
