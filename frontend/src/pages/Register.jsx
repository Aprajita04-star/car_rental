import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, Briefcase } from 'lucide-react';
import '../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card glass reveal">
        <div className="auth-header">
          <UserPlus size={48} className="auth-icon" />
          <h1>Create Account</h1>
          <p>Join AutoRent to start your journey.</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <User size={20} />
            <input 
              name="name"
              type="text" 
              placeholder="Full Name" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="input-group">
            <Mail size={20} />
            <input 
              name="email"
              type="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="input-group">
            <Phone size={20} />
            <input 
              name="phone"
              type="text" 
              placeholder="Phone Number" 
              value={formData.phone}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="input-group">
            <Briefcase size={20} />
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="Customer">Customer</option>
              <option value="Owner">Car Owner / Dealer</option>
            </select>
          </div>
          <div className="input-group">
            <Lock size={20} />
            <input 
              name="password"
              type="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
