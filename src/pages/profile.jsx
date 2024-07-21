import React, { useContext } from 'react';
import AuthContext from '../context/authcontent';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
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
