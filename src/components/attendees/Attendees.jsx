import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './attendees.css';

const AttendeesPage = () => {
    const { eventId } = useParams();
    const [attendees, setAttendees] = useState([]);
    const [eventTitle, setEventTitle] = useState("");

    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                // Fetch the event's attendees
                const res = await axios.get(`https://event-management-system-backend-00sp.onrender.com/api/events/${eventId}/attendees`, { withCredentials: true });
                setAttendees(res.data);
            } catch (error) {
                console.error('Error fetching attendees:', error);
            }
        };

        const fetchEventTitle = async () => {
            try {
                // Fetch event details for the title
                const res = await axios.get(`https://event-management-system-backend-00sp.onrender.com/api/events/${eventId}`);
                setEventTitle(res.data.title);
            } catch (error) {
                console.error('Error fetching event title:', error);
            }
        };

        fetchAttendees();
        fetchEventTitle();
    }, [eventId]);

    return (
        <div className="attendees-page">
            <h2>Attendees for Event: {eventTitle}</h2>
            <p className="attendee-count">Total Attendees: {attendees.length}</p>
            {attendees.length > 0 ? (
                <ul className="attendees-list">
                    {attendees.map((attendee) => (
                        <li key={attendee._id} className="attendee-item">
                            <p><strong>Name:</strong> {attendee.name}</p>
                            <p><strong>Email:</strong> {attendee.email}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No attendees registered yet.</p>
            )}
        </div>
    );
};

export default AttendeesPage;
