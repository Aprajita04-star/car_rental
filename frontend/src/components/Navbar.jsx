import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, User, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled glass' : ''}`}>
      <div className="container nav-content">
        <Link to="/" className="logo">
          <Car size={32} className="logo-icon" />
          <span>Auto<span className="accent">Rent</span></span>
        </Link>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/listings" onClick={() => setIsOpen(false)}>Cars</Link>
          
          {user ? (
            <>
              <Link to="/my-bookings" onClick={() => setIsOpen(false)}>My Bookings</Link>
              {(user.role === 'Admin' || user.role === 'Developer') && (
                <Link to="/admin" className={user.role === 'Developer' ? 'dev-link' : 'admin-link'} onClick={() => setIsOpen(false)}>
                  <ShieldCheck size={18} /> {user.role === 'Developer' ? 'Admin / Dev' : 'Admin'}
                </Link>
              )}
              {user.role === 'Owner' && (
                <Link to="/owner-dashboard" onClick={() => setIsOpen(false)}>Owner Dashboard</Link>
              )}
              <div className={`user-profile ${user.role === 'Developer' ? 'dev-profile' : ''}`}>
                {user.role === 'Developer' && <span className="dev-badge">Dev Mode</span>}
                <User size={20} />
                <span>{user.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="register-btn" onClick={() => setIsOpen(false)}>Register</Link>
            </div>
          )}
        </div>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
