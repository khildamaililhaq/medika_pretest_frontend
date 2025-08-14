'use client';
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
  Collapse,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  MenuBook as BookIcon,
  Assignment as LoanIcon,
  CheckCircle as AvailableIcon,
  Warning as ActiveIcon,
  ExpandMore as ExpandMoreIcon,
  Error as OverdueIcon,
  Schedule as DueSoonIcon,
  AssignmentReturn as ReturnedIcon,
} from '@mui/icons-material';
import Link from 'next/link';

const Navigation = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [booksOpen, setBooksOpen] = useState(false);
  const [loansOpen, setLoansOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleBooksToggle = () => {
    setBooksOpen(!booksOpen);
  };

  const handleLoansToggle = () => {
    setLoansOpen(!loansOpen);
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Library System
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem 
          component={Link} 
          href="/"
          onClick={() => isMobile && setMobileOpen(false)}
          sx={{
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        
        <ListItemButton onClick={handleBooksToggle}>
          <ListItemIcon><BookIcon /></ListItemIcon>
          <ListItemText primary="Books" />
          <ExpandMoreIcon sx={{ transform: booksOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
        </ListItemButton>
        <Collapse in={booksOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              component={Link} 
              href="/books"
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{ pl: 4, '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <ListItemIcon><BookIcon /></ListItemIcon>
              <ListItemText primary="All Books" />
            </ListItem>
            <ListItem 
              component={Link} 
              href="/books/available"
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{ pl: 4, '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <ListItemIcon><AvailableIcon /></ListItemIcon>
              <ListItemText primary="Available Books" />
            </ListItem>
          </List>
        </Collapse>
        
        <ListItem 
          component={Link} 
          href="/borrowers"
          onClick={() => isMobile && setMobileOpen(false)}
          sx={{
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Borrowers" />
        </ListItem>
        
        <ListItemButton onClick={handleLoansToggle}>
          <ListItemIcon><LoanIcon /></ListItemIcon>
          <ListItemText primary="Loans" />
          <ExpandMoreIcon sx={{ transform: loansOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
        </ListItemButton>
        <Collapse in={loansOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              component={Link} 
              href="/loans"
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{ pl: 4, '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <ListItemIcon><LoanIcon /></ListItemIcon>
              <ListItemText primary="All Loans" />
            </ListItem>
            <ListItem 
              component={Link} 
              href="/loans/active"
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{ pl: 4, '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <ListItemIcon><ActiveIcon /></ListItemIcon>
              <ListItemText primary="Active Loans" />
            </ListItem>
            <ListItem 
              component={Link} 
              href="/loans/overdue"
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{ pl: 4, '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <ListItemIcon><OverdueIcon /></ListItemIcon>
              <ListItemText primary="Overdue Loans" />
            </ListItem>
            <ListItem 
              component={Link} 
              href="/loans/due-soon"
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{ pl: 4, '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <ListItemIcon><DueSoonIcon /></ListItemIcon>
              <ListItemText primary="Due Soon" />
            </ListItem>
            <ListItem 
              component={Link} 
              href="/loans/returned"
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{ pl: 4, '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <ListItemIcon><ReturnedIcon /></ListItemIcon>
              <ListItemText primary="Returned Loans" />
            </ListItem>
          </List>
        </Collapse>
        
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Library Management System
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Navigation;
