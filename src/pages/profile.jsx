import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/authcontent';
import { getToken } from '../utils/authUtils';
import { Card, Typography, Container } from '@mui/material';
import AppBarLayout from '../components/appBAr/persistaneAppbar';
import ContentList from '../../src/components/content/contentlist';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.log('Please login with proper details');
    }
    if (user && user.email) {
      const name = user.email.split('@')[0];
      setUsername(name.charAt(0).toUpperCase() + name.slice(1));
    }
  }, [user]);

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div>
      <AppBarLayout title="User Profile" />
      <Container>
        <Card style={{ padding: '20px', marginTop: '20px' }}>
          <div>
            <Typography variant="h5" sx={{ color: 'orange', fontWeight: 'bold' }}>
              Hi {username}
            </Typography>
          </div>
          <Typography variant="body1">E-Mail: {user.email}</Typography>
          <Typography variant="body1">Role: {user.role}</Typography>
        </Card>
        <ContentList contents={[]} username={username} />  {/* Pass username */}
      </Container>
    </div>
  );
};

export default Profile;
