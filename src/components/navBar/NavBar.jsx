// NavBar.js
import React from 'react';

const NavBar = ({ onSearch }) => {
    return (
        <nav style={styles.navBar}>
            <div style={styles.logo}>Event Dashboard</div>
            <form style={styles.searchForm} onSubmit={onSearch}>
                <input 
                    type="text" 
                    name="location" 
                    placeholder="Search by Location" 
                    style={styles.input}
                />
                <input 
                    type="date" 
                    name="date" 
                    placeholder="Search by Date" 
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Search</button>
            </form>
        </nav>
    );
};

const styles = {
    navBar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        backgroundColor: '#333',
        color: '#fff'
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold'
    },
    searchForm: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    input: {
        padding: '5px',
        fontSize: '16px'
    },
    button: {
        padding: '5px 10px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        cursor: 'pointer'
    }
};

export default NavBar;
