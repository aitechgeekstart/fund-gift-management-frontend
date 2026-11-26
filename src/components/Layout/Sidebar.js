"use client";
import LegacyNextLink from "@/components/Global/LegacyNextLink";
import PopConfirm from "@/components/Global/PopConfirm";
import navigatorConfig from "@/components/navigatorConfig";
import { useAuth } from "@/hooks/use-auth";
import useEffectOnce from "@/hooks/use-effect-once";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import CircleIcon from "@mui/icons-material/Circle";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { compact } from "lodash";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const _drawerWidth = 300;
export const drawerWidth = _drawerWidth;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  color: theme.palette.drawer.textMain,
  zIndex: 9999,
  "&:hover, &:focus": {
    color: theme.palette.drawer.textHover,
    backgroundColor: theme.palette.drawer.hover,
  },
  span: {
    fontSize: "12px",
    fontWeight: 600,
  },
}));

const StyledListItemButton = styled((props) => <ListItemButton {...props} />)(
  ({ theme }) => ({
    background: theme.palette.drawer.main,
    color: theme.palette.drawer.textMain,
    padding: "5px 23px",
    "& .MuiTypography-root": {
      fontSize: "12px",
    },
    "&:hover, &:focus": {
      color: theme.palette.drawer.textHover,
      backgroundColor: theme.palette.drawer.hover,
    },
    "&.Mui-selected": {
      backgroundColor: theme.palette.drawer.selected,
    },
  }),
);

const StyledList = styled((props) => <List {...props} />)(({ theme }) => ({
  "& .Mui-selected": {
    backgroundColor: theme.palette.drawer.selected,
    "&:hover, &:focus": {
      color: theme.palette.drawer.textHover,
      backgroundColor: theme.palette.drawer.hover,
    },
  },
}));

const StyledListItem = styled((props) => <ListItem {...props} />)(
  ({ theme }) => ({
    padding: "0 0 0 23px",
    "& .Mui-selected": {
      backgroundColor: theme.palette.drawer.selected,
      "&:hover, &:focus": {
        color: theme.palette.drawer.textHover,
        backgroundColor: theme.palette.drawer.hover,
      },
    },
  }),
);

const StyledDrawer = styled((props) => <Drawer {...props} />)(({ theme }) => ({
  width: _drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: _drawerWidth,
    boxSizing: "border-box",
    paddingTop: "48px",
    borderRight: "0px",
    backgroundColor: theme.palette.menu.background,
  },
}));

const _DrawerHeader = styled("div")(({ theme }) => {
  return {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    minHeight: 48,
  };
});
export const DrawerHeader = _DrawerHeader;

const ToolbarStyleWrapper = styled("div")(({ theme }) => {
  return {
    backgroundColor: theme.palette.appBar.backgroundColor,
    color: theme.palette.appBar.text,
    boxShadow: `0px 0px 5px ${theme.palette.appBar.boxShadow}`,
  };
});

const CustomListItemIcon = styled((props) => <ListItemIcon {...props} />)(
  () => ({
    minWidth: "36px",
  }),
);

const CustomListItemText = styled((props) => <ListItemText {...props} />)(
  () => ({
    textTransform: "uppercase",
  }),
);

export default function Sidebar({ open, handleDrawerOpen, handleDrawerClose }) {
  const theme = useTheme();
  const { getNavigators } = navigatorConfig();
  const auth = useAuth();
  const params = useParams();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [opens, setOpens] = useState({});
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [sidebarActiveKeys, setSidebarActiveKeys] = useState([]);
  const userMenuOpen = Boolean(userMenuAnchorEl);
  const screenBreakMatched = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    if (auth.authStatus === "no") {
      window.location = "/login";
    }
  }, [auth.authStatus]);

  useEffectOnce(() => {
    const parsedUrl = new URL(window.location.href);
    const pathnames = parsedUrl.pathname.split("/");
    let key = [];
    pathnames.map((x) => {
      if (x !== "auth") {
        key.push(x.toUpperCase());
      }
    });
    key = compact(key);
    if (key.length > 1) {
      setOpens({ [key[0]]: true });
    }
    setSidebarActiveKeys(key);
  });

  if (auth.authStatus === "preparing") {
    return <></>;
  }

  const handleOpenChildren = (key) => {
    const _opens = {
      ...opens,
    };
    _opens[key] = !_opens[key];
    setOpens(_opens);
  };

  const handleSetSidebarActiveKeys = (key) => {
    setSidebarActiveKeys(key);
  };

  const handleUserButtonOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserButtonClose = () => {
    setUserMenuAnchorEl(null);
  };

  const logout = async () => {
    await auth.logout();
    setUserMenuAnchorEl(null);
    // window.location = "/login";
    setConfirmLogout(false);
  };

  const handleLogout = () => {
    setConfirmLogout(true);
  };

  const handleProfile = () => {
    window.location = `/auth/my_profile`;
  };

  const handleClose = () => {
    setConfirmLogout(false);
  };

  const renderChildren = (_children, masterKey) => {
    return _children.map(({ key, value, to, icon }) => (
      <LegacyNextLink
        key={key}
        href={to ? to : "#"}
        passHref
        style={{ textDecoration: "none" }}
      >
        <StyledListItem component="span">
          <StyledListItemButton
            selected={sidebarActiveKeys.includes(key)}
            onClick={() => {
              handleSetSidebarActiveKeys([masterKey, key]);
              handleDrawerClose();
            }}
          >
            <CustomListItemIcon>
              {icon ? (
                icon
              ) : (
                <Brightness1Icon fontSize="8px" sx={{ color: "#FFF" }} />
              )}
            </CustomListItemIcon>
            <CustomListItemText>{value}</CustomListItemText>
          </StyledListItemButton>
        </StyledListItem>
      </LegacyNextLink>
    ));
  };

  return (
    <>
      <AppBar position="fixed" open={open}>
        <ToolbarStyleWrapper>
          <Toolbar variant="dense">
            <Grid>
              <IconButton
                color="white"
                aria-label="open drawer"
                onClick={() => {
                  open ? handleDrawerClose() : handleDrawerOpen();
                }}
                edge="start"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid>
              <Typography variant="body" noWrap component="div">
                PINE WEALTH SOLUTION
              </Typography>
            </Grid>
            {screenBreakMatched && (
              <Grid
                container
                direction="row"
                spacing={2}
                sx={{ alignItems: "center", justifyContent: "flex-end" }}
              >
                <Grid size={12}>
                  <Button
                    color="white"
                    size="large"
                    onClick={handleUserButtonOpen}
                    aria-controls={userMenuOpen ? "user-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={userMenuOpen ? "true" : undefined}
                  >
                    {auth.user?.profile_image ? (
                      <Avatar src={auth.user.profile_image.url} />
                    ) : (
                      <AccountCircleIcon />
                    )}
                    <span style={{ paddingLeft: "5px" }}>
                      {!!auth.user
                        ? [
                            auth.user.first_name_en || auth.user.first_name_th,
                            auth.user.last_name_en || auth.user.last_name_th,
                          ].join(" ")
                        : auth?.user?.email}
                    </span>
                  </Button>
                  <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={userMenuAnchorEl}
                    open={userMenuOpen}
                    onClose={handleUserButtonClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <MenuItem sx={{ width: "240px" }} onClick={handleProfile}>
                      <AccountCircleIcon sx={{ mr: "5px" }} />
                      Profile
                    </MenuItem>
                    <MenuItem sx={{ width: "240px" }} onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: "5px" }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </Grid>
              </Grid>
            )}
            <PopConfirm
              open={confirmLogout}
              handleClose={handleClose}
              handleApproveFunction={logout}
              buttonTextConfirm="Yes"
              buttonTextCancel="No"
              content={
                <>
                  <WarningAmberIcon fontSize="large" color="warning" />
                  <br />
                  Are you sure you want to log out?
                </>
              }
            />
          </Toolbar>
        </ToolbarStyleWrapper>
      </AppBar>
      <StyledDrawer variant="persistent" anchor="left" open={open}>
        <Grid
          container
          direction="column"
          sx={{ justifyContent: "center", height: "100%" }}
        >
          {!screenBreakMatched && (
            <Grid
              size={12}
              sx={{
                height: "5%",
              }}
            >
              <LegacyNextLink
                href="#"
                passHref
                style={{
                  textDecoration: "none",
                }}
              >
                <StyledListItemButton component="span" onClick={handleProfile}>
                  <CustomListItemIcon>
                    {auth.user?.profile_image ? (
                      <Avatar src={auth.user.profile_image.url} />
                    ) : (
                      <AccountCircleIcon color="white" />
                    )}
                  </CustomListItemIcon>
                  <CustomListItemText>
                    {!!auth.user
                      ? [
                          auth.user.first_name_en || auth.user.first_name_th,
                          auth.user.last_name_en || auth.user.last_name_th,
                        ].join(" ")
                      : auth?.user?.email}
                  </CustomListItemText>
                </StyledListItemButton>
              </LegacyNextLink>
            </Grid>
          )}
          {/* Menu section */}
          <Grid
            size={12}
            sx={{
              height: !screenBreakMatched ? "78%" : "98%",
              margin: "17px 0 0 0px",
            }}
          >
            <span
              style={{
                color: theme.palette.white.main,
                margin: "17px 0 0 25px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              Menu
            </span>
            <StyledList
              style={{
                textDecoration: "none",
                overflowY: "auto",
                height: !screenBreakMatched ? "95%" : "97%",
              }}
            >
              {getNavigators(params).map(
                ({ key, value, children, to, icon }) =>
                  children ? (
                    <Box key={key}>
                      <StyledListItemButton
                        onClick={() => handleOpenChildren(key)}
                        selected={sidebarActiveKeys.includes(key)}
                      >
                        <CustomListItemIcon>
                          {icon ? (
                            icon
                          ) : (
                            <CircleIcon sx={{ opacity: 0.05 }}></CircleIcon>
                          )}
                        </CustomListItemIcon>
                        <CustomListItemText>{value}</CustomListItemText>
                        {opens[key] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </StyledListItemButton>
                      <Collapse in={opens[key]} timeout="auto" unmountOnExit>
                        {renderChildren(children, key)}
                        <Divider sx={{ mt: 2 }} />
                      </Collapse>
                    </Box>
                  ) : (
                    <LegacyNextLink
                      key={key}
                      href={to ? to : "#"}
                      passHref
                      style={{ textDecoration: "none" }}
                    >
                      <StyledListItemButton
                        component="span"
                        selected={sidebarActiveKeys.includes(key)}
                        onClick={() => {
                          handleSetSidebarActiveKeys([key]);
                          handleDrawerClose();
                        }}
                      >
                        <CustomListItemIcon>
                          {icon ? (
                            icon
                          ) : (
                            <CircleIcon sx={{ opacity: 0.05 }}></CircleIcon>
                          )}
                        </CustomListItemIcon>
                        <CustomListItemText>{value}</CustomListItemText>
                      </StyledListItemButton>
                    </LegacyNextLink>
                  ),
              )}
            </StyledList>
          </Grid>
          {/* Logout section */}
          {!screenBreakMatched && (
            <Grid size={12} sx={{ height: "10%" }}>
              <Box sx={{ width: "100%" }}>
                <Divider />
                <StyledList>
                  <StyledListItemButton component="span" onClick={handleLogout}>
                    <CustomListItemIcon>
                      <LogoutIcon sx={{ mr: "5px" }} color="white" />
                    </CustomListItemIcon>
                    <CustomListItemText>Logout</CustomListItemText>
                  </StyledListItemButton>
                </StyledList>
              </Box>
            </Grid>
          )}
        </Grid>
      </StyledDrawer>
    </>
  );
}
