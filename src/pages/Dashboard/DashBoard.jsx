// EventDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/navBar/NavBar.jsx';
import './dashboard.css';

const EventDashboard = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();

    // Fetch token from local storage
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                if (!token) {
                    // Redirect to login if there’s no token
                    navigate('/login');
                    return;
                }
                
                // Pass the token in headers
                const res = await axios.get('https://event-management-system-backend-7qo6.onrender.com/api/auth/currentUser', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setCurrentUserId(res.data._id);
                fetchEvents(); // Fetch events if the user is authenticated
            } catch (error) {
                console.error('Error fetching current user:', error);
                // Redirect to login if authentication fails
                navigate('/login');
            }
        };

        const fetchEvents = async () => {
            try {
                const res = await axios.get('https://event-management-system-backend-7qo6.onrender.com/api/events', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const eventsWithAttendeeData = await Promise.all(res.data.map(async (event) => {
                    const attendeesRes = await axios.get(`https://event-management-system-backend-7qo6.onrender.com/api/events/${event._id}/attendees`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    return {
                        ...event,
                        attendees: attendeesRes.data,
                        attendeeCount: attendeesRes.data.length,
                    };
                }));

                setEvents(eventsWithAttendeeData);
                setFilteredEvents(eventsWithAttendeeData);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchCurrentUser();
    }, [navigate, token]);

    const handleViewAttendees = (eventId) => {
        navigate(`/events/${eventId}/attendees`);
    };

    const handleEditEvent = (eventId) => {
        navigate(`/events/${eventId}/edit`);
    };

    const handleRegisterEvent = (eventId) => {
        navigate(`/events/${eventId}/payment`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const location = e.target.location.value.toLowerCase();
        const date = e.target.date.value;

        const filtered = events.filter(event => {
            const isLocationMatch = event.location.toLowerCase().includes(location);
            const isDateMatch = date ? new Date(event.date).toISOString().slice(0, 10) === date : true;
            return isLocationMatch && isDateMatch;
        });
        
        setFilteredEvents(filtered);
    };

    return (
        <div className="event-dashboard">
            <NavBar onSearch={handleSearch} />
            <div className="dashboard-content">
                <h2>Your Events</h2>
                <ul className="event-list">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => {
                            const isRegistered = event.attendees.some(attendee => attendee._id === currentUserId);
                            
                            return (
                                <li className="event-item" key={event._id}>
                                    <h3 className="event-title">{event.title}</h3>
                                    <p className="event-description">{event.description}</p>
                                    <p className="event-location">{event.location}</p>
                                    <p className="event-ticket-price">Price: {event.ticketPrice}</p>
                                    
                                    {event.organizerId === currentUserId ? (
                                        <div className="event-actions">
                                            <button className="view-attendees-btn" onClick={() => handleViewAttendees(event._id)}>
                                                View Attendees ({event.attendeeCount || 0})
                                            </button>
                                            <button className="edit-event-btn" onClick={() => handleEditEvent(event._id)}>
                                                Edit Event
                                            </button>
                                        </div>
                                    ) : isRegistered ? (
                                        <button className="view-ticket-btn" onClick={() => navigate(`/events/${event._id}/ticket`)}>View Ticket</button>
                                    ) : (
                                        <button className="register-event-btn" onClick={() => handleRegisterEvent(event._id)}>Register for Event</button>
                                    )}
                                </li>
                            );
                        })
                    ) : (
                        <p className="no-events">No events found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default EventDashboard;
