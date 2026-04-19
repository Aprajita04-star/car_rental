import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, Car, Calendar, CheckCircle, XCircle, Users, 
  AlertCircle, Trash2, Star
} from 'lucide-react';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [pendingCars, setPendingCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchManagementData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all cars (Admin View)
      const carsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/admin/cars`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllCars(carsRes.data.data);
      setPendingCars(carsRes.data.data.filter(car => !car.isApproved));

      // Fetch all users
      const usersRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersRes.data.data);

      // Fetch all bookings
      const bookingsRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllBookings(bookingsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.abs(e - s);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  };

  const filteredBookings = filterStatus === 'All' 
    ? allBookings 
    : allBookings.filter(b => b.status === filterStatus);

  useEffect(() => {
    if (user && (user.role === 'Admin' || user.role === 'Developer')) {
      fetchStats();
      fetchManagementData();
    }
  }, [user]);

  const handleApproveCar = async (id, isApproved) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/admin/cars/${id}/approve`, {
        isApproved
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchManagementData();
      fetchStats();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/admin/cars/${id}/featured`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchManagementData();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchManagementData();
      fetchStats();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleDeleteCar = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/admin/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchManagementData();
      fetchStats();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleApproveBooking = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/bookings/${id}`, {
        status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchManagementData();
      fetchStats();
    } catch (err) {
      alert('Action failed');
    }
  };

  if (!user || (user.role !== 'Admin' && user.role !== 'Developer')) return <div className="container">Access Denied.</div>;

  return (
    <div className="admin-dashboard container">
      {user.role === 'Developer' && (
        <div className="dev-banner reveal">
          <BarChart3 size={18} />
          <span>Super-Admin Access Enabled (Developer Mode)</span>
        </div>
      )}
      <div className="dashboard-header">
        <h1 className="text-gradient">{user.role === 'Developer' ? 'Developer Dashboard' : 'Admin Dashboard'}</h1>
        <p>Manage listings, bookings, and platform statistics.</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className={`stat-card glass clickable ${activeTab === 'Cars' ? 'active' : ''}`} onClick={() => setActiveTab('Cars')}>
            <div className="stat-icon car"><Car /></div>
            <div className="stat-info">
              <h3>{stats.totalCars}</h3>
              <p>Total Cars</p>
            </div>
          </div>
          <div className={`stat-card glass clickable ${activeTab === 'Bookings' ? 'active' : ''}`} onClick={() => setActiveTab('Bookings')}>
            <div className="stat-icon booking"><Calendar /></div>
            <div className="stat-info">
              <h3>{stats.totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
          <div className={`stat-card glass clickable ${activeTab === 'Overview' ? 'active' : ''}`} onClick={() => setActiveTab('Overview')}>
            <div className="stat-icon pending"><AlertCircle /></div>
            <div className="stat-info">
              <h3>{stats.pendingCars}</h3>
              <p>Pending Cars</p>
            </div>
          </div>
          <div className={`stat-card glass clickable ${activeTab === 'Users' ? 'active' : ''}`} onClick={() => setActiveTab('Users')}>
            <div className="stat-icon users"><Users /></div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation glass">
        {['Overview', 'Users', 'Cars', 'Bookings'].map(tab => (
          <button 
            key={tab} 
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="dashboard-main">
        {activeTab === 'Overview' && (
          <>
            {/* Pending Car Approvals */}
            <section className="dashboard-section glass reveal">
              <div className="section-header">
                <h2>Pending Car Approvals</h2>
                <span className="badge">{pendingCars.length}</span>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Car</th>
                      <th>Location</th>
                      <th>Owner</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingCars.map(car => (
                      <tr key={car._id}>
                        <td>{car.make} {car.model}</td>
                        <td>{car.city}</td>
                        <td>{car.owner?.name}</td>
                        <td>₹{car.pricePerDay}</td>
                        <td>
                          <div className="action-btns">
                            <button className="approve-btn" title="Approve" onClick={() => handleApproveCar(car._id, true)}>
                              <CheckCircle size={18} />
                            </button>
                            <button className="reject-btn" title="Reject" onClick={() => handleDeleteCar(car._id)}>
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {pendingCars.length === 0 && <p className="empty-msg">No pending car approvals.</p>}
              </div>
            </section>
          </>
        )}

        {activeTab === 'Users' && (
          <section className="dashboard-section glass full-width reveal">
            <div className="section-header">
              <h2>User Management</h2>
              <span className="badge">{users.length}</span>
            </div>
            <div className="table-wrapper">
              <table className="detailed-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td><span className={`role-badge ${u.role.toLowerCase()}`}>{u.role}</span></td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="reject-btn" onClick={() => handleDeleteUser(u._id)} disabled={u.role === 'Developer'}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'Cars' && (
          <section className="dashboard-section glass full-width reveal">
            <div className="section-header">
              <h2>All Vehicles</h2>
              <span className="badge">{allCars.length}</span>
            </div>
            <div className="table-wrapper">
              <table className="detailed-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Owner</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allCars.map(car => (
                    <tr key={car._id}>
                      <td><strong>{car.make} {car.model}</strong> ({car.year})</td>
                      <td>{car.owner?.name}</td>
                      <td>₹{car.pricePerDay}</td>
                      <td>
                        <span className={`status-pill ${car.isApproved ? 'approved' : 'pending'}`}>
                          {car.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className={`feature-btn ${car.isFeatured ? 'active' : ''}`}
                          onClick={() => handleToggleFeatured(car._id)}
                        >
                          {car.isFeatured ? <Star fill="currentColor" size={18} /> : <Star size={18} />}
                        </button>
                      </td>
                      <td>
                        <button className="reject-btn" onClick={() => handleDeleteCar(car._id)}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'Bookings' && (
          /* Detailed System Bookings */
          <section className="dashboard-section glass full-width reveal">
            <div className="section-header-flex">
              <div className="section-header">
                <h2>All System Bookings</h2>
                <span className="badge">{allBookings.length}</span>
              </div>
              <div className="filter-group">
                {['All', 'Pending', 'Approved', 'Rejected', 'Completed'].map(status => (
                  <button 
                    key={status}
                    className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="table-wrapper">
              <table className="detailed-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer Details</th>
                    <th>Car & Owner</th>
                    <th>Dates & Duration</th>
                    <th>Financials</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => {
                    const days = calculateDays(booking.startDate, booking.endDate);
                    const rate = booking.car?.pricePerDay || (booking.totalPrice / days).toFixed(0);
                    
                    return (
                      <tr key={booking._id} className="detailed-row">
                        <td className="id-cell">#{booking._id.slice(-6).toUpperCase()}</td>
                        <td>
                          <div className="user-info">
                            <strong>{booking.customer?.name}</strong>
                            <span>{booking.customer?.email}</span>
                            <span className="phone">{booking.customer?.phone}</span>
                          </div>
                        </td>
                        <td>
                          <div className="car-info">
                            <strong>{booking.car?.make} {booking.car?.model}</strong>
                            <span className="owner-tag">Owner: {booking.car?.owner?.name}</span>
                            <span className="phone">{booking.car?.owner?.phone}</span>
                          </div>
                        </td>
                        <td>
                          <div className="date-info">
                            <div className="date-range">
                              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </div>
                            <span className="duration-badge">{days} Days</span>
                          </div>
                        </td>
                        <td>
                          <div className="price-info">
                            <span className="rate">₹{rate}/day</span>
                            <strong className="total">Total: ₹{booking.totalPrice}</strong>
                          </div>
                        </td>
                        <td>
                          <span className={`status-pill ${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredBookings.length === 0 && <p className="empty-msg">No bookings found matching filters.</p>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
