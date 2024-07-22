import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AppBarLayout = ({ title }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed">
      <Toolbar>
      <Button color="inherit" onClick={() => navigate('/home')}>
          Back to Home
        </Button>
        <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center'  }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarLayout;
