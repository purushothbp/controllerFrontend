import React from 'react';
import Signup from '../components/auth/signup';
import Login from '../components/auth/login';
import GoogleLogin from '../components/auth/googleLogin';

const AuthPage = () => {
  return (
    <div>
      <h1>Authentication</h1>
      <Signup />
      <Login />
      <GoogleLogin />
    </div>
  );
};

export default AuthPage;
