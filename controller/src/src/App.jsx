import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Routes, Route } from "react-router-dom";
import About from './components/Pages/About';
import Settings from './components/Pages/Settings';
import Home from './components/Pages/Home';
import AccountabilityPartner from './components/Pages/AccountabilityPartner';
import AddHabit from './components/Pages/AddHabit';

const App = () => {
  const currentTheme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(currentTheme ? currentTheme : 'light');

  useEffect(() => {
    localStorage.setItem('current_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar theme={theme} setTheme={toggleTheme} />
      <div className="flex-1 overflow-auto">
        <div className={`container ${theme} min-h-screen bg-gray-200 dark:bg-black transition duration-500`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/accountability-partner" element={<AccountabilityPartner />} />
            <Route path="/add-habit" element={<AddHabit />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;

//heatmap wasn't put in yet.