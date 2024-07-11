import React, { useState } from 'react';
import Login from './components/login/login';
import Content from './components/contents/contents';

function App() {
  const [token, setToken] = useState(null);

  const handleLoginSuccess = (token) => {
    setToken(token);
  };

  return (
    <div>
      {token ? (
        <Content token={token} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
