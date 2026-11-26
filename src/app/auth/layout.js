"use client";
import AppCopyright from "@/components/Layout/AppCopyright";
import Breadcrumbs from "@/components/Layout/Breadcrumbs";
import Sidebar, { drawerWidth } from "@/components/Layout/Sidebar";
import ApplicationConfigProvider from "@/hooks/use-application-config";
import { AuthProvider } from "@/hooks/use-auth";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { Suspense, useState } from "react";

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => {
  return {
    flexGrow: 1,
    padding: theme.spacing(3),
    height: "100%",
    width: !open && "100%", // กำหนดค่าเริ่มต้นให้เป็น 100%
    [theme.breakpoints.up("md")]: {
      width: !open && "100%", // ขนาดหน้าจอขนาด md ขึ้นไปจะมีความกว้างเป็น 100%
    },
    [theme.breakpoints.up("xl")]: {
      width: !open && "95%", // ขนาดหน้าจอขนาด xl ขึ้นไปจะมีความกว้างเป็น 80%
    },
    ...(!!open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: `${drawerWidth}px`,
    }),
    ...(!open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: theme.breakpoints.up("xl") ? "auto" : 0,
      marginRight: theme.breakpoints.up("xl") ? "auto" : 0,
    }),
  };
});

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <ApplicationConfigProvider>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <AuthProvider>
          <Sidebar
            open={open}
            handleDrawerOpen={handleDrawerOpen}
            handleDrawerClose={handleDrawerClose}
            sx={{ width: "230px" }}
          />
          <Suspense>
            <Main open={open} onClick={handleDrawerClose}>
              <Breadcrumbs />
              <Suspense fallback={<CircularProgress />}>{children}</Suspense>
              <AppCopyright sx={{ mt: 8, mb: 4 }} />
            </Main>
          </Suspense>
        </AuthProvider>
      </SnackbarProvider>
    </ApplicationConfigProvider>
  );
}
