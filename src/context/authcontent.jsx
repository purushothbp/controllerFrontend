// src/context/authcontent.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      const decoded = jwt.decode(token);
      setUser(decoded);
    }
  }, []);

  const login = async (userData) => {
    // Perform login logic here (e.g., fetch from API)

    // Example user data after successful login
    const userData = {
      uuid: '958fc32b-6bb9-4715-b7ff-89f1d968b70e',
      role: 'guest',
    };

    const token = jwt.sign(userData, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your actual secret key
    Cookies.set('authToken', token);

    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
