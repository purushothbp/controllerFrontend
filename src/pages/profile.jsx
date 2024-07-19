import React, { useContext } from 'react';
import AuthContext from '../context/authcontent';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Profile</h1>
      {user ? (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default Profile;
