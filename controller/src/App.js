import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import AddHabit from './components/Pages/AddHabit';
import Habit from './components/Pages/Habit';
import Home from './components/Pages/Home';
import About from './components/Pages/About';
import Settings from './components/Pages/Settings';

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
        {/* react router routes */}
        <Routes>
          <Route path="/" element={<Home username={username} />} />
          <Route path="/about" element={<About username={username} />} />
          <Route path="/settings" element={<Settings username={username} setUsername={setUsername}/>} />
          <Route path="/habits" element={<Habit username={username}/>} />
          <Route path="/add-habit" element={<AddHabit username={username}/>} />
        </Routes>

      </div>
    </div>
  );
}

export default App;
