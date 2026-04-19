import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Gauge, Settings, MapPin } from 'lucide-react';
import '../styles/CarCard.css';

const CarCard = ({ car }) => {
  return (
    <div className="car-card glass reveal">
      <div className="car-image">
        <img 
          src={car.images[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'} 
          alt={`${car.make} ${car.model}`} 
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800' }}
        />
        <div className="car-type-overlay">
          <span className="car-type-badge">{car.type}</span>
        </div>
      </div>
      
      <div className="car-info">
        <div className="car-header">
          <div className="title-group">
            <h3>{car.make} {car.model}</h3>
            <div className="car-location">
              <MapPin size={14} />
              <span>{car.city}</span>
            </div>
          </div>
          <div className="price-tag">
            <span className="currency">₹</span>
            <span className="amount">{car.pricePerDay}</span>
            <span className="period">/day</span>
          </div>
        </div>

        <div className="car-specs-grid">
          <div className="spec-pill">
            <Fuel size={14} />
            <span>{car.specs.fuelType || 'Petrol'}</span>
          </div>
          <div className="spec-pill">
            <Settings size={14} />
            <span>{car.specs.transmission || 'Auto'}</span>
          </div>
          <div className="spec-pill">
            <Gauge size={14} />
            <span>{car.specs.mileage || '15km/l'}</span>
          </div>
        </div>

        <Link to={`/car/${car._id}`} className="view-details-btn">
          <span>View Details</span>
          <div className="btn-glow"></div>
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
