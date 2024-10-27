// EventCreation.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './eventCreation.css'; // Import the CSS file

const EventCreation = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        ticketPrice: '',
        privacy: 'public', // Default value
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://localhost:6600/api/events/create', formData, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the Authorization header
                }
            });
            setSuccess(response.data.message);
            setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                location: '',
                ticketPrice: '',
                privacy: 'public',
            });
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to create event');
        }
    };

    return (
        <div className="container">
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
                </div>
                <div>
                    <label>Date:</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div>
                    <label>Time:</label>
                    <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                </div>
                <div>
                    <label>Location:</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required />
                </div>
                <div>
                    <label>Ticket Price:</label>
                    <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} required />
                </div>
                <div>
                    <label>Privacy:</label>
                    <select name="privacy" value={formData.privacy} onChange={handleChange}>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <button type="submit">Create Event</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default EventCreation;
