import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Fuel, Gauge, Settings, MapPin, Calendar, CheckCircle, Info } from 'lucide-react';
import '../styles/CarDetail.css';

const CarDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: ''
  });
  const [bookingStatus, setBookingStatus] = useState({ type: '', msg: '' });

  const fetchCar = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/cars/${id}`);
      setCar(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCar();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/bookings`, {
        car: id,
        ...bookingData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setBookingStatus({ type: 'success', msg: 'Booking enquiry submitted successfully! Awaiting owner/admin approval.' });
      }
    } catch (err) {
      setBookingStatus({ type: 'error', msg: err.response?.data?.error || 'Booking failed.' });
    }
  };

  if (loading) return <div className="loading-state container">Loading car details...</div>;
  if (!car) return <div className="container">Car not found.</div>;

  return (
    <div className="car-detail-page container">
      <div className="detail-grid">
        {/* Left: Images and Info */}
        <div className="detail-main">
          <div className="main-image glass">
            <img src={car.images[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200'} alt={car.model} />
          </div>
          
          <div className="car-description glass">
            <h2>About this car</h2>
            <p>{car.description || 'No description available for this vehicle.'}</p>
            
            <div className="specs-extended">
              <div className="spec-card">
                <Fuel size={24} />
                <label>Fuel Type</label>
                <span>{car.specs.fuelType || 'Petrol'}</span>
              </div>
              <div className="spec-card">
                <Settings size={24} />
                <label>Transmission</label>
                <span>{car.specs.transmission || 'Automatic'}</span>
              </div>
              <div className="spec-card">
                <Gauge size={24} />
                <label>Mileage</label>
                <span>{car.specs.mileage || '15km/l'}</span>
              </div>
              <div className="spec-card">
                <Calendar size={24} />
                <label>Year</label>
                <span>{car.year}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="detail-sidebar">
          <div className="booking-card glass">
            <div className="booking-header">
              <h1>{car.make} {car.model}</h1>
              <div className="location">
                <MapPin size={18} />
                <span>{car.city}</span>
              </div>
              <div className="price-tag">
                ₹{car.pricePerDay}<span>/day</span>
              </div>
            </div>

            <form className="booking-form" onSubmit={handleBooking}>
              <div className="input-group-stack">
                <label>Pickup Date</label>
                <input 
                  type="date" 
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                  required 
                />
              </div>
              <div className="input-group-stack">
                <label>Return Date</label>
                <input 
                  type="date" 
                  value={bookingData.endDate}
                  onChange={(e) => setBookingData({...bookingData, endDate: e.target.value})}
                  required 
                />
              </div>

              {bookingStatus.msg && (
                <div className={`notification ${bookingStatus.type}`}>
                  {bookingStatus.type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
                  <span>{bookingStatus.msg}</span>
                </div>
              )}

              <button type="submit" className="book-btn">
                Book This Car
              </button>
            </form>

            <div className="owner-info">
              <span>Owner: {car.owner?.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
