import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar'

const App = () => {
// Grabs the current theme from localStorage, if it's unable to do this => default to light.
  const current_theme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(current_theme? current_theme : 'light');

// Updates localStorage everytime the theme is switched.
  useEffect(() => {
    localStorage.setItem('current_theme', theme);
  }, [theme])

// Renders the navbar component with the current theme.
  return (
    <div className={`container ${theme}`}> 
      <Navbar theme={theme} setTheme={setTheme}/>
    </div>
  )
}

export default App
