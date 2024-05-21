import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = ({ theme }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/signup', { // Update the URL to your backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
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
    <div className={`flex items-center justify-center min-h-screen transition-colors duration-500 ease-in-out ${theme === 'light' ? 'bg-gray-100' : 'bg-zinc-900'}`}>
      <div className={`p-8 rounded shadow-md w-full max-w-md transition-colors duration-500 ease-in-out ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              className={`border rounded-md px-4 py-2 w-full transition-colors duration-500 ease-in-out ${theme === 'light' ? 'bg-gray-200 text-black border-gray-300' : 'bg-gray-700 text-white border-gray-600'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Create Username:</label>
            <input
              type="text"
              className={`border rounded-md px-4 py-2 w-full transition-colors duration-500 ease-in-out ${theme === 'light' ? 'bg-gray-200 text-black border-gray-300' : 'bg-gray-700 text-white border-gray-600'}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Create Password:</label>
            <input
              type="password"
              className={`border rounded-md px-4 py-2 w-full transition-colors duration-500 ease-in-out ${theme === 'light' ? 'bg-gray-200 text-black border-gray-300' : 'bg-gray-700 text-white border-gray-600'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md transition-colors duration-500 ease-in-out hover:bg-blue-600">
            Sign Up
          </button>
        </form>
        <p className="mt-4">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;