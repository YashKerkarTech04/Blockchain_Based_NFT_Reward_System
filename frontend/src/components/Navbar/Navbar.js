// src/components/Navbar.js
import React from "react";
import "./Navbar.css";

export default function Navbar({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem("username"); // clear user session
    if (onLogout) onLogout(); // optional callback
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">🎓 Student Portal</div>
      <ul className="navbar-links">
        <li><a href="/">Home</a></li>
        <li><a href="/achievements">My Achievements</a></li>
        <li><a href="/profile">Profile</a></li>
      </ul>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}
