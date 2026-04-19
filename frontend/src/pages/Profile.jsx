import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Shield, Calendar } from 'lucide-react';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <div className="container">Please login.</div>;

  return (
    <div className="profile-page container">
      <div className="profile-card glass">
        <div className="profile-header">
          <div className="avatar">
            <User size={64} />
          </div>
          <h1>{user.name}</h1>
          <div className="role-badge">{user.role}</div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <Mail size={20} />
            <div>
              <label>Email Address</label>
              <span>{user.email}</span>
            </div>
          </div>
          <div className="detail-item">
            <Phone size={20} />
            <div>
              <label>Phone Number</label>
              <span>{user.phone}</span>
            </div>
          </div>
          <div className="detail-item">
            <Shield size={20} />
            <div>
              <label>Account Role</label>
              <span>{user.role}</span>
            </div>
          </div>
          <div className="detail-item">
            <Calendar size={20} />
            <div>
              <label>Member Since</label>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
