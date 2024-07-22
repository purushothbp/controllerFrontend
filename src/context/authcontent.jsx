import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const googleLogin = async (tokenId) => {
    try {
      const response = await axios.post('http://localhost:3003/api/auth/google-login', { tokenId });
      const userDetails = { ...response.data.user, token: response.data.token };
      localStorage.setItem('user', JSON.stringify(userDetails));
      Cookies.set('token', response.data.token, { expires: 1 });
      setUser(userDetails);
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    Cookies.remove('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
