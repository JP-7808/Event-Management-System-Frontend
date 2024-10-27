// PaymentPage.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './paymentPage.css';

const PaymentPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    // Mock Payment Gateway Function (replace with real payment gateway integration)
    const handlePayment = async () => {
        // Mock payment success
        try {
            const res = await axios.post(`https://event-management-system-backend-7qo6.onrender.com/api/events/${eventId}/ticket`, {}, { withCredentials: true });
            alert('Payment Successful! You are now registered for the event.');

            // Redirect to Event Dashboard after payment
            navigate(`/events/${eventId}/ticket`);
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        }
    };

    return (
        <div className="payment-page">
            <h2>Complete Payment</h2>
            <p>Price: $10.00</p> {/* Replace with dynamic price if necessary */}
            <button onClick={handlePayment} className="pay-now-btn">Pay Now</button>
        </div>
    );
};

export default PaymentPage;
