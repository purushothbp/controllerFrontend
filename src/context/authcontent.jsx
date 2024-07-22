import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async (token) => {
      try {
        const decoded = jwtDecode(token);
        const response = await axios.get(`http://localhost:3003/api/users/${decoded.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        Cookies.remove('token');
        setUser(null);
      }
    };

    const token = Cookies.get('token');
    if (token) {
      fetchUserDetails(token);
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
