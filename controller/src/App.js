import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import AddHabit from './components/Pages/AddHabit';
import Habit from './components/Pages/Habit';
import Home from './components/Pages/Home';
import About from './components/Pages/About';
import Settings from './components/Pages/Settings';
import LoginPage from './components/Pages/Login';
import SignupPage from './components/Pages/Signup'; 
import { isAuthenticated } from './functions/auth';

const App = () => {
  const currentTheme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(currentTheme ? currentTheme : 'light');

  useEffect(() => {
    localStorage.setItem('current_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const [username, setUsername] = useState("hello there");

  return (
    <div className={`transition-colors duration-500 ease-in-out h-screen ${theme === 'light' ? 'bg-gray-100 text-black' : 'bg-zinc-900 text-white'}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className={`container mx-auto px-4 ${theme}`}>
        <Routes>
          <Route path="/" element={isAuthenticated() ? <Home username={username} /> : <Navigate to="/login" />} />
          <Route path="/about" element={isAuthenticated() ? <About username={username} /> : <Navigate to="/login" />} />
          <Route path="/settings" element={isAuthenticated() ? <Settings username={username} setUsername={setUsername} /> : <Navigate to="/login" />} />
          <Route path="/habits" element={isAuthenticated() ? <Habit username={username} /> : <Navigate to="/login" />} />
          <Route path="/add-habit" element={isAuthenticated() ? <AddHabit username={username} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage theme={theme} />} />
          <Route path="/signup" element={<SignupPage theme={theme} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
