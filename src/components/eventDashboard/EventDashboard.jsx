import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EventDashboard = () => {
    const [events, setEvents] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('https://event-management-system-backend-00sp.onrender.com/api/events', { withCredentials: true });
                const eventsWithAttendeeCount = await Promise.all(res.data.map(async (event) => {
                    const attendeesRes = await axios.get(`https://event-management-system-backend-00sp.onrender.com/api/events/${event._id}/attendees`, { withCredentials: true });
                    return {
                        ...event,
                        attendeeCount: attendeesRes.data.length, // Assuming attendeesRes.data contains the list of attendees
                    };
                }));
                setEvents(eventsWithAttendeeCount);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get('https://event-management-system-backend-00sp.onrender.com/api/auth/currentUser', { withCredentials: true });
                setCurrentUserId(res.data._id);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchEvents();
        fetchCurrentUser();
    }, []);

    const handleViewAttendees = async (eventId) => {
        navigate(`/events/${eventId}/attendees`);
    };

    const handleEditEvent = (eventId) => {
        navigate(`/events/${eventId}/edit`);
    };

    const handleRegisterEvent = async (eventId) => {
        try {
            const res = await axios.post(`https://event-management-system-backend-00sp.onrender.com/api/events/${eventId}/register`, {}, { withCredentials: true });
            alert(res.data.msg);

            // Refresh events list to update attendee count and details
            const updatedEvents = events.map(event =>
                event._id === eventId 
                    ? { ...event, attendeeCount: res.data.attendeeCount, attendees: res.data.attendees } 
                    : event
            );
            setEvents(updatedEvents);
        } catch (error) {
            console.error(`Error registering for event ${eventId}:`, error);
            alert('Failed to register for the event. Please try again later.');
        }
    };

    return (
        <div>
            <h2>Your Events</h2>
            <ul>
                {events.length > 0 ? (
                    events.map(event => (
                        <li key={event._id}>
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            {event.organizerId === currentUserId ? (
                                <>
                                    <button onClick={() => handleViewAttendees(event._id)}>View Attendees ({event.attendeeCount || 0})</button>
                                    <button onClick={() => handleEditEvent(event._id)}>Edit Event</button>
                                </>
                            ) : (
                                <button onClick={() => handleRegisterEvent(event._id)}>Register for Event</button>
                            )}
                        </li>
                    ))
                ) : (
                    <p>No events available.</p>
                )}
            </ul>
        </div>
    );
};

export default EventDashboard;
