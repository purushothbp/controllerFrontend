import React, { useContext, useEffect } from 'react';
import AuthContext from '../context/authcontent';
import { getToken } from '../utils/authUtils';

const Profile = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const token = getToken();
    if (token) {
      console.log('Token:', token);
    }
    console.log('User in Profile:', user);
  }, [user]);

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div>
      <h1>Authentication</h1>
      <div>
        <p>UUID: {user.uuid}</p>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>First Name: {user.firstName}</p>
        <p>Last Name: {user.lastName}</p>
      </div>
    </div>
  );
};

export default Profile;
