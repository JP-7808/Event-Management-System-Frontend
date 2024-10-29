import React from 'react';
import './navBar.css';

const NavBar = ({ onSearch }) => {
    return (
        <nav className="nav-bar">
            <div className="logo">Event Dashboard</div>
            <form className="search-form" onSubmit={onSearch}>
                <input 
                    type="text" 
                    name="location" 
                    placeholder="Search by Location" 
                    className="input"
                />
                <input 
                    type="date" 
                    name="date" 
                    placeholder="Search by Date" 
                    className="input"
                />
                <button type="submit" className="button">Search</button>
            </form>
        </nav>
    );
};

export default NavBar;
