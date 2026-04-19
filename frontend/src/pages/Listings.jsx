import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import CarCard from '../components/CarCard';
import { Search, Filter, SlidersHorizontal, MapPin } from 'lucide-react';
import '../styles/Listings.css';

const Listings = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
    sort: '-createdAt'
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/cars/locations`);
        setLocations(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLocations();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/cars?sort=${filters.sort}`;
      if (filters.type) url += `&type=${filters.type}`;
      if (filters.city) url += `&city=${filters.city}`;
      
      const res = await axios.get(url);
      setCars(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="listings-page container">
      <div className="listings-header">
        <h1>Available Cars</h1>
        <p>Explore our wide range of vehicles available for rent in India.</p>
      </div>

      <div className="filters-section glass">
        <div className="filter-group">
          <label><Search size={16} /> City</label>
          <div className="search-input-wrapper">
             <input 
              type="text" 
              name="city" 
              placeholder="Filter by city..." 
              list="listings-locations"
              value={filters.city}
              onChange={handleFilterChange}
            />
            <datalist id="listings-locations">
              {locations.map(loc => (
                <option key={loc} value={loc} />
              ))}
            </datalist>
          </div>
        </div>
        
        <div className="filter-group">
          <label><Filter size={16} /> Type</label>
          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
          </select>
        </div>

        <div className="filter-group">
          <label><SlidersHorizontal size={16} /> Sort By</label>
          <select name="sort" value={filters.sort} onChange={handleFilterChange}>
            <option value="-createdAt">Newest First</option>
            <option value="pricePerDay">Price: Low to High</option>
            <option value="-pricePerDay">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Finding cars for you...</p>
        </div>
      ) : cars.length > 0 ? (
        <div className="cars-grid">
          {cars.map(car => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      ) : (
        <div className="empty-state glass">
          <h3>No cars found</h3>
          <p>Try adjusting your filters or search for a different city.</p>
        </div>
      )}
    </div>
  );
};

export default Listings;
