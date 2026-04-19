import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Calendar, Star, Shield, Zap, ChevronDown } from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/cars/locations`);
        setLocations(res.data.data);
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };
    fetchLocations();

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    let query = '/listings';
    const params = [];
    if (searchCity) params.push(`city=${searchCity}`);
    if (searchDate) params.push(`date=${searchDate}`);
    
    if (params.length > 0) {
      query += `?${params.join('&')}`;
    }
    navigate(query);
  };

  const selectLocation = (city) => {
    setSearchCity(city);
    setShowDropdown(false);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content reveal">
          <h1 className="hero-title">
            Reliable <span className="accent">Car Rentals</span> <br />
            for Every Day
          </h1>
          <p className="hero-subtitle">
            Find the perfect car for your daily commute or family trips. From hatchbacks to reliable SUVs, 
            we have the right vehicle for Indian roads.
          </p>

          <div className="search-bar">
            <div className="search-group" ref={dropdownRef}>
              <MapPin className="search-icon" size={20} />
              <div className="input-wrapper" onClick={() => setShowDropdown(!showDropdown)}>
                <input 
                  type="text" 
                  placeholder="Select City" 
                  value={searchCity}
                  readOnly
                  className="dropdown-input"
                />
                <ChevronDown size={18} className={`chevron ${showDropdown ? 'rotate' : ''}`} />
              </div>
              
              {showDropdown && (
                <div className="location-dropdown">
                  {locations.length > 0 ? (
                    locations.map(loc => (
                      <div 
                        key={loc} 
                        className="dropdown-item"
                        onClick={() => selectLocation(loc)}
                      >
                        <MapPin size={16} />
                        <span>{loc}</span>
                      </div>
                    ))
                  ) : (
                    <div className="dropdown-item empty">No locations found</div>
                  )}
                </div>
              )}
            </div>
            <div className="search-group">
              <Calendar className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Select Dates" 
                onFocus={(e) => e.target.type = 'date'} 
                onBlur={(e) => !searchDate && (e.target.type = 'text')}
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>
            <button className="search-btn" onClick={handleSearch}>
              <Search size={20} /> <span>Search</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features container">
        <div className="feature-card glass reveal">
          <Zap className="feature-icon" size={32} />
          <h3>Fast Booking</h3>
          <p>Book your dream car in less than 2 minutes with our streamlined process.</p>
        </div>
        <div className="feature-card glass reveal">
          <Shield className="feature-icon" size={32} />
          <h3>Safe & Secure</h3>
          <p>Every vehicle is inspected and fully insured for your peace of mind.</p>
        </div>
        <div className="feature-card glass reveal">
          <Star className="feature-icon" size={32} />
          <h3>Top Quality</h3>
          <p>Hand-picked premium vehicles maintained to the highest standards.</p>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured container reveal">
        <div className="section-header">
          <h2 className="text-gradient">Featured Categories</h2>
          <Link to="/listings" className="view-all">View All Cars</Link>
        </div>
        <div className="categories-grid">
          {['SUV', 'Sedan', 'Hatchback'].map((type) => (
            <Link to={`/listings?type=${type}`} key={type} className="category-card glass">
              <h3>{type}s</h3>
              <span>Explore Collection</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
