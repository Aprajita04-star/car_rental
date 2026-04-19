import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import '../styles/MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle size={18} className="status-icon approved" />;
      case 'Rejected': return <XCircle size={18} className="status-icon rejected" />;
      case 'Pending': return <AlertCircle size={18} className="status-icon pending" />;
      default: return <Clock size={18} className="status-icon" />;
    }
  };

  if (!user) return <div className="container">Please login to view your bookings.</div>;

  return (
    <div className="my-bookings-page container">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Track the status of your car rental enquiries and bookings.</p>
      </div>

      {loading ? (
        <div className="loading-state">Loading your bookings...</div>
      ) : bookings.length > 0 ? (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-item glass">
              <div className="booking-car-info">
                <h3>{booking.car.make} {booking.car.model}</h3>
                <div className="info-row">
                  <MapPin size={16} />
                  <span>{booking.car.city}</span>
                </div>
              </div>

              <div className="booking-dates">
                <div className="date-box">
                  <Calendar size={16} />
                  <div>
                    <label>From</label>
                    <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="date-box">
                  <Calendar size={16} />
                  <div>
                    <label>To</label>
                    <span>{new Date(booking.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="booking-price">
                <label>Total Price</label>
                <span>₹{booking.totalPrice}</span>
              </div>

              <div className={`booking-status status-${booking.status.toLowerCase()}`}>
                {getStatusIcon(booking.status)}
                <span>{booking.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state glass">
          <h3>No bookings found</h3>
          <p>You haven't made any car enquiries yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
