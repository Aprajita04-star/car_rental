import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Car, Calendar, MapPin, CheckCircle, Clock, XCircle, User } from 'lucide-react';
import '../styles/OwnerDashboard.css';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [myCars, setMyCars] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCar, setNewCar] = useState({
    make: '', model: '', year: '', type: 'Sedan', city: '', pricePerDay: '', description: ''
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch my cars
      const carsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/cars`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter for cars owned by the logged-in user
      setMyCars(carsRes.data.data.filter(car => car.owner._id === user._id));

      // Fetch enquiries for my cars
      const bookingsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnquiries(bookingsRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/cars`, newCar, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddForm(false);
      fetchData();
      alert('Car added! Awaiting admin approval.');
    } catch (err) {
      alert('Failed to add car');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/bookings/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh list
    } catch (err) {
      alert('Action failed: ' + (err.response?.data?.error || 'Server error'));
    }
  };

  return (
    <div className="owner-dashboard container">
      <div className="dashboard-header">
        <h1>Owner Dashboard</h1>
        <button className="add-car-btn" onClick={() => setShowAddForm(true)}>
          <Plus size={20} /> Add New Car
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal glass">
            <h2>Add New Vehicle</h2>
            <form onSubmit={handleAddCar} className="add-car-form">
              <div className="form-grid">
                <input placeholder="Make (e.g. Toyota)" onChange={e => setNewCar({...newCar, make: e.target.value})} required />
                <input placeholder="Model (e.g. Fortuner)" onChange={e => setNewCar({...newCar, model: e.target.value})} required />
                <input type="number" placeholder="Year" onChange={e => setNewCar({...newCar, year: e.target.value})} required />
                <select onChange={e => setNewCar({...newCar, type: e.target.value})}>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                </select>
                <input placeholder="City" onChange={e => setNewCar({...newCar, city: e.target.value})} required />
                <input type="number" placeholder="Price Per Day (₹)" onChange={e => setNewCar({...newCar, pricePerDay: e.target.value})} required />
              </div>
              <textarea placeholder="Description" onChange={e => setNewCar({...newCar, description: e.target.value})}></textarea>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
                <button type="submit" className="submit-btn">List Car</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="dashboard-sections">
        <section className="my-cars glass">
          <div className="section-title">
            <Car size={24} />
            <h2>My Listed Cars</h2>
          </div>
          <div className="cars-list">
            {myCars.map(car => (
              <div key={car._id} className="car-item">
                <div className="car-info">
                  <strong>{car.make} {car.model}</strong>
                  <span>{car.city} • ₹{car.pricePerDay}/day</span>
                </div>
                <div className={`status-badge ${car.isApproved ? 'approved' : 'pending'}`}>
                  {car.isApproved ? <CheckCircle size={14} /> : <Clock size={14} />}
                  {car.isApproved ? 'Live' : 'Awaiting Approval'}
                </div>
              </div>
            ))}
            {myCars.length === 0 && <p className="empty-msg">You haven't listed any cars yet.</p>}
          </div>
        </section>

        <section className="my-enquiries glass">
          <div className="section-title">
            <Calendar size={24} />
            <h2>Recent Enquiries</h2>
          </div>
          <div className="enquiries-list">
            {enquiries.map(enquiry => (
              <div key={enquiry._id} className="enquiry-item">
                <div className="enquiry-details">
                  <div className="customer-info">
                    <User size={16} />
                    <strong>{enquiry.customer?.name}</strong>
                  </div>
                  <div className="enquiry-car">
                    {enquiry.car?.make} {enquiry.car?.model}
                  </div>
                  <div className="enquiry-dates">
                    {new Date(enquiry.startDate).toLocaleDateString()} - {new Date(enquiry.endDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="enquiry-actions">
                  {enquiry.status === 'Pending' ? (
                    <div className="action-btns">
                      <button className="approve-btn" onClick={() => handleStatusUpdate(enquiry._id, 'Approved')}>
                        <CheckCircle size={18} /> Approve
                      </button>
                      <button className="reject-btn" onClick={() => handleStatusUpdate(enquiry._id, 'Rejected')}>
                        <XCircle size={18} /> Reject
                      </button>
                    </div>
                  ) : (
                    <div className={`status-tag ${enquiry.status.toLowerCase()}`}>
                      {enquiry.status === 'Approved' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {enquiry.status}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {enquiries.length === 0 && <p className="empty-msg">No enquiries received yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OwnerDashboard;
