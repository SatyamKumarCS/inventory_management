import React from 'react';
import './style.css';
import { Search, Bell } from 'lucide-react';

const Header = () => {
  return (
    <div className="header">
      <div className="header-inner">
        {/* Search */}
        <div className="search-wrapper">
          <div className="search-icon">
            <Search className="icon" />
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Search product, supplier, order"
          />
        </div>

        {/* Right section */}
        <div className="header-right">
          <button className="icon-button">
            <Bell className="icon" />
          </button>
          <div className="avatar">
            <img
              src="https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740"
              alt="Avatar"
              className="avatar-img"
            />
            <div className="avatar-fallback">User</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
