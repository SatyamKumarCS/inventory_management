import React from 'react';
import './style.css';
import {
  FaChartBar,
  FaBox,
  FaClipboardList,
  FaUsers,
  FaStore,
  FaCogs,
  FaSignOutAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';


const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src="../../../../full logo.png" alt="Logo" className="logo-img" />
      </div>
      <ul className="sidebar-links">
        <li><Link to="/dashboard"></Link><FaChartBar /> Dashboard</li>
        <li><FaBox /> Inventory</li>
        <li><FaClipboardList /> Reports</li>
        <li><FaUsers /> Suppliers</li>
        <li><FaClipboardList /> Orders</li>
        <li><FaStore /> Manage Store</li>
        <li><FaUsers /> Customers</li>
        <li><FaCogs /> Settings</li>
        <li><FaSignOutAlt /> Log Out</li>
      </ul>
    </div>
  );
};

export default Sidebar;
