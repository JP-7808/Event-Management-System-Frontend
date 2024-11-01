import React, { useState } from 'react';
import './register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });
    
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        try {
            const res = await axios.post('https://event-management-system-backend-00sp.onrender.com/api/auth/register', user);
            console.log(res.data);
            alert(res.data, "please Login");
            setUser({ name: '', email: '', password: '' }); 
            navigate('/');
        } catch (err) {
            console.error(err.response.data);
            alert(err.response.data.msg);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="register">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={user.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit" disabled={loading}> 
                    {loading ? 'Registering...' : 'Register'} 
                </button>
            </form>
            {loading && <p>Loading, please wait...</p>} 
        </div>
    );
};

export default Register;
