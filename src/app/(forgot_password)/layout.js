"use client";
import MUIThemeProvider from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/forgot_password/use-auth";
import ApplicationConfigProvider from "@/hooks/use-application-config";
import { CircularProgress, Container } from "@mui/material";
import { Suspense } from "react";

export default function Layout({ children }) {
  return (
    <ApplicationConfigProvider>
      <AuthProvider>
        <Container
          disableGutters // Removes default left and right padding
          sx={{
            // marginLeft: "auto",
            // marginRight: "auto",
            justifyContent: "center",
            width: "100%",
            height: "100vh",
            alignItems: "center",
          }}
        >
          <Suspense fallback={<CircularProgress />}>
            <MUIThemeProvider>{children}</MUIThemeProvider>
          </Suspense>
        </Container>
      </AuthProvider>
    </ApplicationConfigProvider>
  );
}
