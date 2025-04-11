import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/',
    requiresAdmin: false,
  },
  {
    text: 'Membros',
    icon: <PeopleIcon />,
    path: '/members',
    requiresAdmin: true,
  },
  {
    text: 'Orçamentos',
    icon: <DescriptionIcon />,
    path: '/budgets',
    requiresAdmin: true,
  },
];

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          Zeus - Sistema de Gestão Interna
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems
          .filter(item => !item.requiresAdmin || user?.role === 'admin')
          .map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
