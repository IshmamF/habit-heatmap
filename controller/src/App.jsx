import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Heatmap from './components/heatmap';
import { Routes, Route } from "react-router-dom";
import About from './components/Pages/About';
import Settings from './components/Pages/Settings';
import Home from './components/Pages/Home';
import AccountabilityPartner from './components/Pages/AccountabilityPartner';
import AddHabit from './components/Pages/AddHabit';
import Quote from './components/quotes'

const App = () => {
  // Grabs the current theme from localStorage, if it's unable to do this => default to light.
  const currentTheme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(currentTheme ? currentTheme : 'light');

  // Updates localStorage every time the theme is switched.
  useEffect(() => {
    localStorage.setItem('current_theme', theme);
  }, [theme]);

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Renders the navbar component with the current theme.
  return (
    <div>
      <div className={`container ${theme}`}>
        <Navbar theme={theme} setTheme={toggleTheme} />

        {/* react router routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/accountability-partner" element={<AccountabilityPartner />} />
          <Route path="/add-habit" element={<AddHabit />} />
        </Routes>
       <Quote></Quote>
       <Heatmap></Heatmap> 
      </div>
    </div>
  );
}

export default App;
