import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './editEvent.css';
import Navbar from '../nav/Nav';

const EditEvent = () => {
    const { eventId } = useParams(); 
    const [eventData, setEventData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [updating, setUpdating] = useState(false); 
    const [deleting, setDeleting] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`https://event-management-system-backend-00sp.onrender.com/api/events/${eventId}`, { withCredentials: true });
                setEventData(response.data);
            } catch (error) {
                console.error('Error fetching event details:', error);
                setError('Error fetching event details');
            } finally {
                setLoading(false);
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
        setUpdating(true); 

        try {
            const response = await axios.put(`https://event-management-system-backend-00sp.onrender.com/api/events/${eventId}`, eventData, { withCredentials: true });
            alert(response.data.msg); 
            navigate('/dashboard'); 
        } catch (error) {
            console.error('Error updating event:', error);
            setError('Error updating event');
        } finally {
            setUpdating(false); 
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this event?');
        if (!confirmDelete) return;

        setDeleting(true); 
        try {
            await axios.delete(`https://event-management-system-backend-00sp.onrender.com/api/events/${eventId}`, { withCredentials: true });
            alert('Event deleted successfully');
            navigate('/dashboard'); 
        } catch (error) {
            console.error('Error deleting event:', error);
            setError('Error deleting event');
        } finally {
            setDeleting(false); 
        }
    };

    // Handle loading state
    if (loading) {
        return <div className="loading-message">Loading event data...</div>; 
    }

    if (error) {
        return <div className="error-message">{error}</div>; 
    }

    return (
        <>
        <Navbar/>
        <div className="edit-event-container">
            <h2>Edit Event</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleUpdate} className="edit-event-form">
                <div>
                    <label>Title:</label>
                    <input type="text" name="title" value={eventData.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" value={eventData.description} onChange={handleChange} />
                </div>
                <div>
                    <label>Date:</label>
                    <input type="date" name="date" value={eventData.date.split('T')[0]} onChange={handleChange} required />
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
                <div className="edit-event-buttons">
                    <button type="submit" disabled={updating}> {updating ? "Updating..." : "Update Event"} </button>
                    <button type="button" onClick={handleDelete} disabled={deleting} style={{ marginLeft: '10px' }}>
                        {deleting ? "Deleting..." : "Delete Event"}
                    </button>
                </div>
            </form>
        </div>
        </>
    );
};

export default EditEvent;
