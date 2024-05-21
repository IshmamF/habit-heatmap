import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/login', { // Update the URL to your backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block mb-2">Username:</label>
          <input
            type="text"
            className="border rounded-md px-4 py-2 w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password:</label>
          <input
            type="password"
            className="border rounded-md px-4 py-2 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Login
        </button>
      </form>
      <p className="mt-4">
        Don't have an account? <Link to="/signup" className="text-blue-500">Create one</Link>
      </p>
    </div>
  );
};

export default LoginPage;
