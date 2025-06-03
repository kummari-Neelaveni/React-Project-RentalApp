import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="menu-item">
        <Link to="overview" className="menu-button">Overview</Link>
      </div>
      <div className="menu-item">
        <Link to="add-material" className="menu-button">Add Material</Link>
      </div>
      <div className="menu-item">
        <Link to="view-material" className="menu-button">View Material</Link>
      </div>
      <div className="menu-item">
        <Link to="view-bookings" className="menu-button">View Bookings</Link>
      </div>
      <div className="menu-item">
        <Link to="low-stock-alert" className="menu-button">Low Stock Alert</Link>
      </div>
    </div>
  );
};

export default Sidebar;


