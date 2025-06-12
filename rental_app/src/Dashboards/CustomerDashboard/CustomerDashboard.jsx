import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../ConfigFirebase/config';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    const loggedinUserFirebase = JSON.parse(localStorage.getItem("loggedInCustomer")); // singular key
    if (!loggedinUserFirebase) return;

    const fetchCustomerData = async () => {
  try {
    const docRef = doc(db, "Customers", loggedinUserFirebase.user.displayName); 
  
    const docSnap = await getDoc(docRef);
    console.log(docSnap,"docsnap")

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(data,"data")
      setCustomerName(data.name );
    } else {
      console.warn("No customer data found.");
    }
  } catch (error) {
    console.error("Error fetching customer data:", error);
  }
};


    fetchCustomerData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <ul>
            <li><Link to="/dashboard" className="sidebar-link">Overview</Link></li>
            <li><Link to="adminselection" className="sidebar-link">Admin Selection</Link></li>
            <li><Link to="customerbookings" className="sidebar-link">Bookings</Link></li>
            <li><Link to="/settings" className="sidebar-link">Settings</Link></li>
          </ul>
        </div>
        <main className="dashboard-main">
          <div className="dashboard-welcome">
            <h2>Welcome back, {customerName }!</h2>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;










