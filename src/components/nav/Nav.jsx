import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import axios from 'axios';
import './nav.css';

const Navbar = () => {
    const { user, dispatch } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    // Fetch current user details
    const fetchCurrentUser = useCallback(async () => {
        try {
            const response = await axios.get('https://event-management-system-backend-uela.onrender.com/api/auth/currentUser', {
                withCredentials: true,
            });
            setCurrentUser(response.data);
            dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
            localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
            console.error("Failed to fetch current user:", error);
        }
    }, [dispatch]);

    // Fetch user details when the component mounts
    useEffect(() => {
        fetchCurrentUser(); 
    }, [fetchCurrentUser]); 

    const handleLogout = async () => {
        setLoading(true); 
        try {
            await axios.post('https://event-management-system-backend-uela.onrender.com/api/auth/logout', {}, {
                withCredentials: true 
            });
            dispatch({ type: "LOGOUT" });
            localStorage.removeItem("user"); 
            localStorage.removeItem("token"); 
            Cookies.remove('access_token'); 
            setCurrentUser(null); 
            navigate('/'); 
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false); 
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
                        <button
                            onClick={handleLogout}
                            className="navbar-logout"
                            disabled={loading} 
                        >
                            {loading ? "Logging out..." : "Logout"}
                        </button>
                    </>
                ) : (
                    <Link to="/" className="navbar-link">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
