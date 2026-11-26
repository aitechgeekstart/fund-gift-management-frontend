"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Suspense } from "react";

const primary = {
  main: "#716f46",
  dark: "#5a5838",
  light: "#8d8b6a",
  contrastText: "#fdf7dd",
};

const secondary = {
  main: "#9c8a68",
  light: "#9d8a68",
  dark: "#7d6e53",
  contrastText: "#fff",
};

const tertiary = {
  main: "#7f825a",
  dark: "#656848",
  light: "#989b7a",
  contrastText: "#fdf7dd",
};

const yellow = {
  main: "#c9b906",
  light: "#FEF8DE",
};

const grey = {
  main: "#616161",
  light: "#A3A3A3",
  lightlow: "#aeaeae",
  contrastText: "#fff",
};

const white = {
  main: "#ffff",
  contrastText: primary.main,
};

const drawer = {
  main: primary.main,
  textMain: white.main,
  hover: primary.light,
  textHover: white.main,
  buttonhover: primary.dark,
  buttontextHover: white.main,
  selected: primary.dark,
  textSelected: primary.dark,
};
const menu = {
  background: tertiary.main,
  color: tertiary.contrastText,
  boxShadow: tertiary.main,
};
const appBar = {
  backgroundColor: primary.main,
  text: white.main,
};

const theme = createTheme({
  palette: {
    primary,
    secondary,
    tertiary,
    yellow,
    grey,
    white,
    drawer,
    menu,
    appBar,
    contrastText: {
      default: "#3D3D3D",
    },
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: "var(--font-noto-sans-thai), var(--font-noto-sans), sans-serif",
    htmlFontSize: 16,
    body1: { fontSize: "14px" },
    body2: { fontSize: "12px" },
  },
  spacing: (factor) => {
    const spacingMap = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
    return spacingMap[factor] ?? factor * 8;
  },
  components: {
    MuiButton: { defaultProps: { size: "small" } },
    MuiTextField: { defaultProps: { size: "small" } },
    MuiSelect: { defaultProps: { size: "small" } },
    MuiTable: { defaultProps: { size: "small" } },
    MuiIconButton: { defaultProps: { size: "small" } },
    MuiChip: { defaultProps: { size: "small" } },
    MuiPagination: { defaultProps: { size: "small" } },
  },
});

export default function MUIThemeProvider({ children }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<CircularProgress />}>{children}</Suspense>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
