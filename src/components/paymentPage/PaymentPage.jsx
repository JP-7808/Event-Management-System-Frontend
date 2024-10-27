import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useNavigate, useParams } from 'react-router-dom';
import './paymentPage.css';

const PaymentPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    
    // Fetch event details to get the price
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`https://event-management-system-backend-00sp.onrender.com/api/events/${eventId}`, {withCredentials : true});
                setEvent(res.data);
                console.log("res", res);
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        };
        fetchEvent();
    }, [eventId]);

    const handlePayment = async () => {
        try {
            const orderRes = await axios.post('https://event-management-system-backend-00sp.onrender.com/api/payments/create-order', { amount: event.ticketPrice }, {withCredentials : true});
            console.log("Order Response", orderRes);
            const { order } = orderRes.data;

            const options = {
                key: "rzp_live_Egt4Xg9w6VBRsl", // Razorpay key
                amount: order.amount,
                currency: 'INR',
                name: 'Event Management System',
                description: `Payment for ${event.title}`,
                order_id: order.id,
                handler: async function (response) {
                    // Handle successful payment here
                    try {
                        const ticketRes = await axios.post(`https://event-management-system-backend-00sp.onrender.com/api/events/${eventId}/ticket`, {}, { withCredentials: true });
                        alert('Payment Successful! You are now registered for the event.');
                        navigate(`/events/${eventId}/ticket`);
                    } catch (error) {
                        console.error('Error processing ticket:', error);
                    }
                },
                prefill: {
                    name: "Your Name",
                    email: "your.email@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Error during payment:', error);
            alert('Payment failed. Please try again.');
        }
    };

    if (!event) return <p>Loading event details...</p>;

    return (
        <div className="payment-page">
            <h2>Complete Payment</h2>
            <p>Price: ₹{event.ticketPrice}</p>
            <button onClick={handlePayment} className="pay-now-btn">Pay Now</button>
        </div>
    );
};

export default PaymentPage;
