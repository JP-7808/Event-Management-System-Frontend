import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditEvent = () => {
    const { eventId } = useParams(); // Get the event ID from the URL
    const [eventData, setEventData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:6600/api/events/${eventId}`, { withCredentials: true });
                setEventData(response.data);
            } catch (error) {
                console.error('Error fetching event details:', error); // Log error for debugging
                setError('Error fetching event details'); // Set error message to display
            }
        };

        fetchEvent();
    }, [eventId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.put(`http://localhost:6600/api/events/${eventId}`, eventData, { withCredentials: true });
            alert(response.data.msg); // Notify user on success
            navigate('/dashboard'); // Redirect to dashboard or event list after updating
        } catch (error) {
            console.error('Error updating event:', error); // Log error for debugging
            setError('Error updating event'); // Set error message to display
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this event?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:6600/api/events/${eventId}`, { withCredentials: true });
            alert('Event deleted successfully');
            navigate('/dashboard'); // Redirect after deletion
        } catch (error) {
            console.error('Error deleting event:', error); // Log error for debugging
            setError('Error deleting event'); // Set error message to display
        }
    };

    // Handle loading state separately
    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>; // Show error message if there's an error
    }

    if (!eventData) {
        return <div>Loading...</div>; // Show loading message while fetching data
    }

    return (
        <div>
            <h2>Edit Event</h2>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>Title:</label>
                    <input type="text" name="title" value={eventData.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" value={eventData.description} onChange={handleChange}></textarea>
                </div>
                <div>
                    <label>Date:</label>
                    <input type="date" name="date" value={eventData.date.split('T')[0]} onChange={handleChange} required /> {/* Format date for input */}
                </div>
                <div>
                    <label>Time:</label>
                    <input type="time" name="time" value={eventData.time} onChange={handleChange} required />
                </div>
                <div>
                    <label>Location:</label>
                    <input type="text" name="location" value={eventData.location} onChange={handleChange} required />
                </div>
                <div>
                    <label>Ticket Price:</label>
                    <input type="number" name="ticketPrice" value={eventData.ticketPrice} onChange={handleChange} required />
                </div>
                <div>
                    <label>Privacy:</label>
                    <select name="privacy" value={eventData.privacy} onChange={handleChange}>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <button type="submit">Update Event</button>
                <button type="button" onClick={handleDelete} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
                    Delete Event
                </button>
            </form>
        </div>
    );
};

export default EditEvent;
