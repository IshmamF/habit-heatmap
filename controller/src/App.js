import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import AddHabit from './components/Pages/AddHabit';
import AccountabilityPartner from './components/Pages/AccountabilityPartner';
import Home from './components/Pages/Home';
import About from './components/Pages/About';
import Settings from './components/Pages/Settings';
import Heatmap from './components/heatmap';

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
    <div className={`transition-colors duration-500 ease-in-out h-screen ${theme === 'light' ? 'bg-gray-100 text-black' : 'bg-zinc-900 text-white'}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <div className={`container mx-auto px-4 ${theme}`}>
        {/* react router routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/accountability-partner" element={<AccountabilityPartner />} />
          <Route path="/add-habit" element={<AddHabit />} />
        </Routes>

        <Heatmap theme={theme} />
      </div>
    </div>
  );
}

export default App;
