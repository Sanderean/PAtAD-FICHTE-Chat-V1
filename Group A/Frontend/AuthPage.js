import React, { useState } from 'react';
import axios from 'axios';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { username, password });
      console.log('Login successful:', response.data);
      // Handle successful login (e.g., redirect to dashboard)
    } catch (error) {
      console.error('Login failed:', error.response.data);
      // Handle login error (e.g., display error message)
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('/api/register', { username, password });
      console.log('Registration successful:', response.data);
      // Handle successful registration (e.g., display success message)
    } catch (error) {
      console.error('Registration failed:', error.response.data);
      // Handle registration error (e.g., display error message)
    }
  };

  return (
    <div>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default AuthPage;
