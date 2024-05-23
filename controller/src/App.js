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
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('current_theme') || 'light');
  const [user, loading, error] = useAuthState(auth);

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
      <div className={`container mx-auto px-4 mt-12 ${theme}`}>
        <Routes>
          <Route path="/login" element={<LoginPage theme={theme} />} />
          <Route path="/signup" element={<SignupPage theme={theme} />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home username={username} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About username={username} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings username={username} setUsername={setUsername} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/habits"
            element={
              <ProtectedRoute>
                <Habit username={username} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-habit"
            element={
              <ProtectedRoute>
                <AddHabit username={username} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;