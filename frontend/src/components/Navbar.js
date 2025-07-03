import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };
  
  const cartItemCount = cart?.items?.length || 0;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          Smart Grocery
        </Typography>

        {currentUser ? (
          <>
            {!isAdmin && (
              <IconButton 
                color="inherit" 
                component={RouterLink} 
                to="/cart"
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
            
            <Box>
              <IconButton
                onClick={handleMenuOpen}
                color="inherit"
                aria-controls={open ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {currentUser.name?.charAt(0).toUpperCase() || <AccountCircleIcon />}
                </Avatar>
              </IconButton>
              
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'user-button',
                }}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    {currentUser.email}
                  </Typography>
                </MenuItem>
                <Divider />
                
                <MenuItem 
                  onClick={() => {
                    handleMenuClose();
                    navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
                  }}
                >
                  Dashboard
                </MenuItem>
                
                <MenuItem 
                  onClick={() => {
                    handleMenuClose();
                    navigate('/profile');
                  }}
                >
                  Profile
                </MenuItem>
                
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </>
        ) : (
          <>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/login"
              sx={{ mr: 1 }}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              component={RouterLink} 
              to="/register"
            >
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;