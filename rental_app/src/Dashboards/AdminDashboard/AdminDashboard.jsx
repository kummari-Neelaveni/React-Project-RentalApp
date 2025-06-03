import React from 'react';
import Sidebar from './Sidebar/Sidebar';

import './AdminDashboard.css'; // Styling file
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="sidebar-section">
        <Sidebar />
      </div>
      <div className="display-section">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;


