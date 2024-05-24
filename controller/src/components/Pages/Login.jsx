import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

const LoginPage = ({ theme }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(`Login Successful! Welcome: ${user.displayName || user.email}`);
      console.log("username: ", username);
      localStorage.setItem('username', username);
      navigate('/');
    } catch (error) {
      console.error('Error:', error.message);
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen transition-colors duration-500 ease-in-out ${theme === 'light' ? 'bg-gray-100' : 'bg-zinc-900'}`}>
      <div className={`p-8 rounded shadow-md w-full max-w-md transition-colors duration-500 ease-in-out ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin}>
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
            <label className="block mb-2">Username:</label>
            <input
              type="text"
              className={`border rounded-md px-4 py-2 w-full transition-colors duration-500 ease-in-out ${theme === 'light' ? 'bg-gray-200 text-black border-gray-300' : 'bg-gray-700 text-white border-gray-600'}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password:</label>
            <input
              type="password"
              className={`border rounded-md px-4 py-2 w-full transition-colors duration-500 ease-in-out ${theme === 'light' ? 'bg-gray-200 text-black border-gray-300' : 'bg-gray-700 text-white border-gray-600'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md transition-colors duration-500 ease-in-out hover:bg-blue-600">
            Login
          </button>
        </form>
        <p className="mt-4">
          Don't have an account? <Link to="/signup" className="text-blue-500">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;