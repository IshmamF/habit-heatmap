import React from 'react';
import logoLight from '../../assets/logo-white.png';
import logoDark from '../../assets/logo-dark.png';
import toggleLight from '../../assets/night.png';
import toggleDark from '../../assets/day.png';
import { Link } from "react-router-dom";

const Navbar = ({ theme, toggleTheme }) => {
    return (
        <nav className={`p-16 flex justify-between items-center transition-colors duration-500 ${theme === 'light' ? 'bg-gray-300 text-black' : 'bg-black text-white'}`}>
            <div>
                <img src={theme === 'light' ? logoLight : logoDark} alt="" className="h-auto w-40" />
            </div>
            <ul className="flex space-x-4">
                <li><Link to="/" className="navbar-link transition-colors ">Home</Link></li>
                <li><Link to="/add-habit" className="navbar-link transition-colors">Add Habit</Link></li>
                <li><Link to="/accountability-partner" className="navbar-link transition-colors">Accountability Partner</Link></li>
                <li><Link to="/settings" className="navbar-link transition-colors">Settings</Link></li>
                <li><Link to="/about" className="navbar-link transition-colors">About</Link></li>
            </ul>
            <div>
                {/* Invoke toggleTheme when the button is clicked */}
                <img onClick={toggleTheme} src={theme === 'light' ? toggleLight : toggleDark} alt="" className="h-8" />
            </div>
        </nav>
    );
};

export default Navbar;
