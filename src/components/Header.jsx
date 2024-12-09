import * as React from "react";
import { useState, useEffect,useLayoutEffect } from "react";
import Swal from "sweetalert2";
import AxiosHealth from "../interceptor/axiosHealth";
import { Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Tooltip } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupIcon from "@mui/icons-material/Group";
import EventNoteIcon from "@mui/icons-material/EventNote";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import MedicationIcon from "@mui/icons-material/Medication";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import GroupsIcon from "@mui/icons-material/Groups";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";

import ReactSwitch from "react-switch";
import { useThemeContext } from "../Theme/ThemeContext";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {

  const { contextTheme, setContextTheme } = useThemeContext();
  const [checked, setChecked] = useState(false);

  const handleSwitch = (nextChecked) => {
    setContextTheme((state) => (state === "Dark" ? "Light" : "Dark"));
    setChecked(nextChecked);
    console.log(nextChecked);
  };

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openUss = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  function cerrarSesion() {
    window.location.replace("../");
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [usuario, setUsuario] = useState([]);

  let idUsuario = localStorage.getItem("idUsuario");
  let token = localStorage.getItem("token");

  useEffect(() => {
    AxiosHealth.get(`/usuarios`)
      .then((res) => setUsuario(res.data))
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: error.message,
          text: "Parece que quieres ingresar a la pagina sin haber logueado enteriormente...",
          footer:
            '<a href="../register">¿Aun no tienes cuenta? ¡Clickeame!</a>',
          backdrop: `
                      rgba(0,0,0,1)
                    `,
          allowOutsideClick: false,
        }).then(function (result) {
          if (result.value) {
            window.location.href = "/";
          }
        });
      });
  }, []);

  const [notificationState, setNotificationState] = useState('none'); // 'none', 'alert', 'notification'
  const [blink, setBlink] = useState(false);

  useLayoutEffect(() => {
    let interval;
    if (notificationState !== 'none') {
      interval = setInterval(() => {
        setBlink(prev => !prev);
      }, 1000);
    } else {
      clearInterval(interval);
      setBlink(false);
    }

    return () => clearInterval(interval);
  }, [notificationState]);

  const getNotificationColor = () => {
    switch (notificationState) {
      case 'alert':
        return blink ? 'red' : 'inherit';
      case 'notification':
        return blink ? '#90ee90' : 'inherit'; // Light green
      default:
        return 'inherit'; // Default color
    }
  };

  return (
    <Box>
      <CssBaseline />
      <AppBar open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5 }}
          >
            <MenuIcon />
          </IconButton>

          <div className="container">
            <div className="">
              <div className="">
                <div className="header">
                  <Button
                    aria-controls={openUss ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openUss ? "true" : undefined}
                    onClick={handleClick}
                    startIcon={
                      <Avatar>
                        <img className="img-fluid" src={usuario.imgPerfil} alt="" />
                      </Avatar>
                    }
                    style={{
                      borderRadius: 35,
                      color: "white",
                      margin: "10px 36px",
                      fontSize: "18px",
                    }}
                    endIcon={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ExpandMoreIcon />
                      </div>
                    }
                  >
                    {usuario.nombre} {usuario.apellido}
                  </Button>
                    <NotificationsIcon style={{ marginLeft: 8, color: getNotificationColor() }} />
                </div>
              </div>
            </div>
          </div>

          <Menu
            anchorEl={anchorEl}
            open={openUss}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              component={Link}
              to={"/perfil"}
              style={{ color: "black" }}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              Mi Perfil
            </MenuItem>
            <hr />
            <MenuItem onClick={() => cerrarSesion()}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              Cerrar Sesion.
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          <ListItem button component={Link} to="/elementos" onClick={handleDrawerClose}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Inicio" placement="right">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Inicio" />
            </div>
          </ListItem>
          <ListItem button component={Link} to="/historiaMedica" onClick={handleDrawerClose}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Historia Medica" placement="right">
                <ListItemIcon>
                  <EventNoteIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Historia Medica" />
            </div>
          </ListItem>
          <ListItem button component={Link} to="/profesionales" onClick={handleDrawerClose}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Profesionales" placement="right">
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Profesionales" />
            </div>
          </ListItem>
          <ListItem button component={Link} to="/institucionesDeSalud" onClick={handleDrawerClose}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Instituciones de Salud" placement="right">
                <ListItemIcon>
                  <LocalHospitalIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Instituciones" />
            </div>
          </ListItem>
          <ListItem button component={Link} to="/calendarioVacunacion" onClick={handleDrawerClose}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Calendario de Vacunacion" placement="right">
                <ListItemIcon>
                  <VaccinesIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Vacunas" />
            </div>
          </ListItem>
          <ListItem button component={Link} to="/medicacionHabitual" onClick={handleDrawerClose}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Medicacion Habitual" placement="right">
                <ListItemIcon>
                  <MedicationIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Medicamentos" />
            </div>
          </ListItem>
          <ListItem button component={Link} to="/grupos" onClick={handleDrawerClose}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Grupos" placement="right">
                <ListItemIcon>
                  <GroupsIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Grupos" />
            </div>
          </ListItem>
          <ListItem button component={Link} to="/agendaTurnos" onClick={handleDrawerClose}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Agenda de Turnos" placement="right">
                <ListItemIcon>
                  <EditCalendarIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Agenda" />
            </div>
          </ListItem>
          <ListItem button component={Link} to="/documentos" onClick={handleDrawerClose}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Docuementos" placement="right">
                <ListItemIcon>
                  <FilePresentIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Documentos" />
            </div>
          </ListItem>
          <ListItem button component={Link} to="/signosVitales" onClick={handleDrawerClose}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Signos Vitales" placement="right">
                <ListItemIcon>
                  <MonitorHeartIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Signos Vitales" />
            </div>
          </ListItem>
          <ListItem button component={Link} to="/informes" onClick={handleDrawerClose}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Informes" placement="right">
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Informes" />
            </div>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        <DrawerHeader />
      </Box>
    </Box>
  );
}
