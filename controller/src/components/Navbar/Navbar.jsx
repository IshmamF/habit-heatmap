import React from 'react';
import { Link } from "react-router-dom";
import toggleLight from '../../assets/night.png';
import toggleDark from '../../assets/day.png';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const Navbar = ({ theme, toggleTheme }) => {
    const [user, loading, error] = useAuthState(auth);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    };

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}>
            <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-16">
                <div>
                    <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-white' : 'text-white'}`}>Habit Heatmap</h1>
                </div>
                <ul className="flex space-x-6">
                    <li><Link to="/" className="text-lg font-medium transition-colors hover:opacity-80">Home</Link></li>
                    <li><Link to="/add-habit" className="text-lg font-medium transition-colors hover:opacity-80">Add Habit</Link></li>
                    <li><Link to="/habits" className="text-lg font-medium transition-colors hover:opacity-80">Habits</Link></li>
                    <li><Link to="/settings" className="text-lg font-medium transition-colors hover:opacity-80">Settings</Link></li>
                    <li><Link to="/about" className="text-lg font-medium transition-colors hover:opacity-80">About</Link></li>
                </ul>
                {loading ? (
                    <div>Loading...</div>
                ) : user ? (
                    <div>
                        <button onClick={handleLogout} className="text-lg font-medium transition-colors bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Logout</button>
                    </div>
                ) : (
                    <div>
                        <Link to="/login" className="text-lg font-medium transition-colors bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Login</Link>
                    </div>
                )}
                <div className="ml-4">
                    <img onClick={toggleTheme} src={theme === 'light' ? toggleLight : toggleDark} alt="Toggle Theme" className="h-8 cursor-pointer" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;