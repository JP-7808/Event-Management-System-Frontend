// TicketPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ticket.css';
import Navbar from '../nav/Nav';

const TicketPage = () => {
    const { eventId } = useParams();
    const [ticket, setTicket] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await axios.get(`https://event-management-system-backend-uela.onrender.com/api/events/${eventId}/ticket`, { withCredentials: true });
                setTicket(res.data);
            } catch (error) {
                console.error('Error fetching ticket:', error);
            }
        };

        fetchTicket();
    }, [eventId]);

    if (!ticket) return <p>Loading ticket...</p>;

    return (
        <>
        <Navbar/>
        <div className="ticket-page">
            <h2>Your Ticket</h2>
            <p>Event: {ticket.event.title}</p>
            <p>Date: {new Date(ticket.event.date).toLocaleDateString()}</p>
            <p>Time: {ticket.event.time}</p>
            <p>Location: {ticket.event.location}</p>
            <p>Attendee: {ticket.user.name}</p>
            <p>Ticket ID: {ticket._id}</p>
        </div>
        </>
    );
};

export default TicketPage;
