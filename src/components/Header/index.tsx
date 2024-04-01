import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StoreIcon from "@mui/icons-material/Store";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import "./header.css";
import echocrmlogo from "../../assets/echocrmlogo.png";
import { AuthContext } from "../../contexts/auth";
import { useContext } from "react";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = [
  "Home",
  "Perfil",
  "Clientes",
  "Agendamentos",
  "Produtos",
  "Faturamento",
];
const navLinks = [
  "home",
  "perfil",
  "clientes",
  "agenda",
  "produtos",
  "faturamento",
];
const icons = [
  <HomeIcon />,
  <ManageAccountsIcon />,
  <GroupsIcon />,
  <CalendarMonthIcon />,
  <StoreIcon />,
  <BarChartIcon />,
];

export default function Header(props: Props) {
  const { logout }: any = useContext(AuthContext);
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center", height: "100%" }}
      className="backgroundColorGrey"
    >
      <Typography
        variant="h6"
        sx={{ my: 2, color: "#e3e2e9" }}
        className="flex"
      >
        <img src={echocrmlogo} alt="Avatar" className="logo" />
        Echo CRM
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <Link
                to={`/${navLinks[navItems.indexOf(item)]}`}
                className="Link"
              >
                {icons[navItems.indexOf(item)]}
                <ListItemText primary={item} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
        <button onClick={logout} className="logoutBtn">
          <LogoutIcon />
        </button>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ position: "initial" }}>
        <Toolbar className="backgroundColorGrey">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <img src={echocrmlogo} alt="Avatar" className="logo" />
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,

              color: "#e3e2e9",
            }}
          >
            Echo CRM
          </Typography>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexShrink: 1,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {navItems.map((item) => (
              <Button key={item} sx={{ color: "#fff" }}>
                <Link
                  to={`/${navLinks[navItems.indexOf(item)]}`}
                  className="Link"
                >
                  {" "}
                  {icons[navItems.indexOf(item)]}{" "}
                  <p className="LinkText">{item}</p>
                </Link>
              </Button>
            ))}
            <button onClick={logout} className="logoutBtn">
              <LogoutIcon />
            </button>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
