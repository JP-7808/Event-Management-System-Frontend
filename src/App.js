import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashBoard from './pages/Dashboard/DashBoard';
import EventCreation from './components/eventCreation/EventCreation';
import EditEvent from './components/editEvent/EditEvent';
import PaymentPage from './components/paymentPage/PaymentPage';
import TicketPage from './components/ticket/Ticket';
import AttendeesPage from './components/attendees/Attendees';
import MainPage from './pages/mainPage/MainPage';

const App = () => {
    return (
        
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<MainPage/>} />
                        {/* Use ProtectedRoute to guard the dashboard */}
                        <Route path='/dashboard' element={<DashBoard/>} />
                        <Route path="/eventCreation" element={<EventCreation/>} />

                        <Route path="/events/:eventId/edit" element={<EditEvent />} />

                        <Route path="/events/:eventId/payment" element={<PaymentPage/>} />
                        <Route path="/events/:eventId/ticket" element={<TicketPage/>} />
                        <Route path="/events/:eventId/attendees" element={<AttendeesPage />} />

                    </Routes>
                </div>
            </Router>
        
    );
};

export default App;
