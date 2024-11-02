import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import axios from 'axios';
import './nav.css';

const Navbar = () => {
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        // Check authentication status and fetch user details if logged in
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get('https://event-management-system-backend-uela.onrender.com/api/auth/status', { 
                    withCredentials: true 
                });
                if (response.data.isAuthenticated) {
                    // Dispatch the user data to context
                    dispatch({ type: "LOGIN_SUCCESS", payload: response.data.user });
                } else {
                    // If not authenticated, clear any existing user data
                    dispatch({ type: "LOGOUT" });
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
            }
        };

        checkAuthStatus();
    }, [dispatch]);

    const handleLogout = async () => {
        try {
            await axios.post('https://event-management-system-backend-uela.onrender.com/api/auth/logout', {}, {
                withCredentials: true
            });
            dispatch({ type: "LOGOUT" });
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            Cookies.remove('access_token');
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }
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
