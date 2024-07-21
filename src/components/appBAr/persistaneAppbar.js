// src/components/PersistentAppBar.js

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, InputBase, Menu, MenuItem, IconButton, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, Button } from '@mui/material';
import { Search as SearchIcon, Person4Sharp } from '@mui/icons-material';
import { alpha, styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authcontent';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const PersistentAppBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConfirmLogout = () => {
    handleDialogClose();
    logout();
    navigate('/');
  };

  const handleEditProfile = () => {
    handleMenuClose();
    navigate('/edit-profile');
  };

  const handleUserManagement = () => {
    handleMenuClose();
    navigate('/admin/users');
  };

  const handleContentManagement = () => {
    handleMenuClose();
    navigate('/admin/content');
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
          {user && user.role === 'admin' ? 'Admin Dashboard' : 'Product List'}
        </Typography>
        {user && (user.role === 'guest' || user.role === 'learner') && (
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
            />
            {/* Implement voice assistant for typing */}
          </Search>
        )}
        <IconButton edge="end" onClick={handleProfileMenuOpen} color="inherit">
          <Person4Sharp />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {user && (user.role === 'guest' || user.role === 'learner') ? (
            <>
              <MenuItem onClick={handleEditProfile}>View Profile</MenuItem>
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </>
          ) : user && user.role === 'admin' ? (
            <>
              <MenuItem onClick={handleUserManagement}>User Management</MenuItem>
              <MenuItem onClick={handleContentManagement}>Content Management</MenuItem>
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </>
          ) : null}
        </Menu>
      </Toolbar>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default PersistentAppBar;
