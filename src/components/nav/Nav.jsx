import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './nav.css'; // Import the external CSS file

const Navbar = () => {
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
        localStorage.removeItem("user"); // Remove user from localStorage
        localStorage.removeItem("token"); // Remove token from localStorage
        navigate('/'); // Redirect to the homepage after logout
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">Event Management</Link>
            </div>
            <div className="navbar-links">
                {user ? (
                    <>
                        <span className="navbar-welcome">Welcome, {user.name}!</span>
                        <Link to="/eventCreation" className="navbar-link">Create Event</Link>
                        <Link to="/dashboard" className="navbar-link">All Events</Link>
                        <button onClick={handleLogout} className="navbar-logout">Logout</button>
                    </>
                ) : (
                    <Link to="/" className="navbar-link">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
