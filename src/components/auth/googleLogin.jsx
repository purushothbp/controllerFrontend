import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginPage = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const navigate = useNavigate();
  const apiUrl = 'http://localhost:3003';

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const decode = jwtDecode(credentialResponse.credential);
      const googleLoginDetails = {
        firstname: decode.given_name,
        lastname: decode.family_name,
        email: decode.email,
      };
      const response = await axios.post(`${apiUrl}/api/auth/google-login`, { email:googleLoginDetails.email, firstName:googleLoginDetails.firstname, lastName:googleLoginDetails.lastname});
      navigate('/home')
      return response;

    } catch (error) {
      console.log("error", error);
    }
  };

  const onFailure = (response) => {
    console.error('Google login failed', response);
  };

  return (
    <div>
      <h1>Login with Google</h1>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onFailure={onFailure}
          cookiePolicy={'single_host_origin'}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleLoginPage;
