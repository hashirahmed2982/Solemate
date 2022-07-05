import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DiscountIcon from '@mui/icons-material/Discount';
import { AccountCircle } from '@mui/icons-material';
import { Menu, MenuItem } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useNavigate } from "react-router-dom";

const drawerWidth = 270;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }), 
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function SMHeader({children}) {
  const theme = useTheme();
  let navigate = useNavigate(); 
  const [open, setOpen] = React.useState(false);

  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDiscountClick = () =>{ 
    let path = '/smManageDiscounts'; 
    setOpen(false);
    navigate(path);
  }

  const handlePerformanceClick = () => {
    let path = '/smAnalyzePerformance'
    setOpen(false);
    navigate(path);
  }

  const handleHomeClick = () => {
    let path = '/smHome'
    setOpen(false);
    navigate(path);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx ={{ backgroundColor: 'primary.main' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Toolbar sx={{ backgroundColor: 'primary.main', display:'flex', justifyContent:"space-between", width:'100%' }}>
            <Link style={{ textDecoration: 'none', color: '#ffffff'}} to='/'>
              <Typography variant="h5" noWrap component="div">
                solemate
              </Typography>
            </Link>
            
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>My Account</MenuItem>
                <MenuItem onClick={handleClose}>Sign Out</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
        <ListItemButton 
            key='Home' 
            sx={{ 
              minHeight: 48, 
              justifyContent: open ? 'initial' : 'center', 
              px: 2.5 
            }} 
            onClick={handleHomeClick}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary='Home' sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
          <ListItemButton 
            key='Products' 
            sx={{ 
              minHeight: 48, 
              justifyContent: open ? 'initial' : 'center', 
              px: 2.5 
            }} 
            onClick={handleDiscountClick}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <DiscountIcon />
            </ListItemIcon>
            <ListItemText primary='Discounts' sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
          <ListItemButton 
            key='Deliveries' 
            sx={{ 
              minHeight: 48, 
              justifyContent: open ? 'initial' : 'center', 
              px: 2.5 
            }} 
            onClick={handlePerformanceClick}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <AutoGraphIcon />
            </ListItemIcon>
            <ListItemText primary='Performance' sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
          {/* 
          
          */}
        </List>
        <Divider />
      </Drawer>
      {children}
    </Box>
  );
}
