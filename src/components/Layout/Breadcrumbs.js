"use client";
import { useApplicationConfig } from "@/hooks/use-application-config";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function BasicBreadcrumbs() {
  const { breadcrumbs } = useApplicationConfig();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  if (breadcrumbs.length == 0) {
    return <Breadcrumbs sx={{ height: "35px", pt: 1 }} />;
  } else {
    return (
      <Breadcrumbs
        sx={{ height: "35px", pt: 1, mt: 2.35 }}
        color="inherit"
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
      >
        {!matches &&
          breadcrumbs.map(({ name, to, query }, index) => {
            const props = {};
            props.color = "inherit";
            props.value = `${name}-${to}`;
            if (to) {
              props.underline = "none";
              props.href = to;
              let path = `/auth/${to}`;
              if (!!query) {
                path = `${path}?${query}`;
              }
              return (
                <Link key={index} value={props.value} href={path}>
                  {name}
                </Link>
              );
            } else {
              props.underline = "none";
              return (
                <Link key={index} {...props}>
                  {name}
                </Link>
              );
            }
          })}
      </Breadcrumbs>
    );
  }
}
