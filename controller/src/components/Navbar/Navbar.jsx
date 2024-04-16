import React from 'react';
import './Navbar.css';
import logoLight from '../../assets/logo-white.png';
import logoDark from '../../assets/logo-dark.png';
import searchIconLight from '../../assets/search-w.png'; // Inactive
import searchIconDark from '../../assets/search-b.png'; // Inactive
import toggleLight from '../../assets/night.png';
import toggleDark from '../../assets/day.png';
import { Link } from "react-router-dom"


const Navbar = ({ theme, setTheme }) => {
    // Functionality for toggling between light and dark mode.
    const toggleMode = () => {
        theme === 'light' ? setTheme('dark') : setTheme('light');
    };

    return (
        <div className='navbar'>
            <img src={theme === 'light' ? logoLight : logoDark} alt="" className='logo' />
            
            {/* react router links */}
                <ul>
                    <li><Link to="/" className="navbar-link"> Home </Link></li>
                    <li><Link to="/add-habit" className="navbar-link"> Add Habit </Link></li>
                    <li><Link to="/accountability-partner" className="navbar-link"> Accountability Partner </Link></li>
                    <li><Link to="/settings" className="navbar-link"> Settings </Link></li>
                    <li><Link to="/about" className="navbar-link"> About </Link></li>
                </ul>

                {/* Searchbar */}
            {/*<div className='search-box'>
                <input type="text" placeholder='Search'/>
                <img src={theme === 'light' ? searchIconLight : searchIconDark} alt=""/>
            </div>*/}

            <img onClick={toggleMode} src={theme === 'light' ? toggleLight : toggleDark} alt="" className='toggle-icon'/>
        </div>
    );
};

export default Navbar;
