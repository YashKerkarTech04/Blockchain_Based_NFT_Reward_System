import React, { useState } from "react";
import { Link } from "react-router-dom"; // import Link
import "./Navbar.css";

export default function Navbar({ onLogout }) {
  const [achDropdownOpen, setAchDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("username");
    if (onLogout) onLogout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">🎖️ YARCoin</div>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>

        {/* My Achievements with dropdown */}
        <li 
          className="dropdown"
          onMouseEnter={() => setAchDropdownOpen(true)}
          onMouseLeave={() => setAchDropdownOpen(false)}
        >
          <Link to="#">My Achievements ⬇️</Link>
          {achDropdownOpen && (
            <ul className="dropdown-menu">
              <li><Link to="/achievements/pending">Pending ⏳</Link></li>
              <li><Link to="/achievements/declined">Declined ❌</Link></li>
              <li><Link to="/achievements/revision_requested">Revision ✏️</Link></li>
              <li><Link to="/achievements/approved">Approved 🎖️</Link></li>
            </ul>
          )}
        </li>

        <li><Link to="/profile">Profile</Link></li>
      </ul>

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </nav>
  );
}
