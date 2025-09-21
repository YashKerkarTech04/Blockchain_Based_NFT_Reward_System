import React, { useEffect, useState } from "react";
import "./TeacherHome.css";
import Navbar from "../Navbar/Navbar";

export default function TeacherHome() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (username) {
      setLoading(true);
      fetch(`http://localhost:5000/teacher/achievements/${username}`)
        .then((res) => res.json())
        .then((data) => {
          setAchievements(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching achievements:", err);
          setLoading(false);
        });
    }
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    alert("You have been logged out!");
    window.location.href = '/';
  }

  const handleImageError = (e) => {
    e.target.src = "/placeholder-certificate.jpg"; // Fallback image
  }

  return (
    <div>
      <Navbar onLogout={handleLogout}/>
      <div className="teacher-container">
        <h2>📜 Achievements Sent To You</h2>
        
        {loading ? (
          <p className="loading">Loading achievements...</p>
        ) : (
          <div className="card-container">
            {achievements.length > 0 ? (
              achievements.map((ach) => (
                <div key={ach.id} className="achievement-card">
                  <img
                    src={`http://localhost:5000/${ach.certificate}`}
                    alt="certificate"
                    onError={handleImageError}
                  />
                  <div className="card-content">
                    <h3>{ach.achievementName}</h3>
                    <p><strong>Position:</strong> {ach.position}</p>
                    <p><strong>Description:</strong> {ach.description}</p>
                    <p><strong>Date:</strong> {new Date(ach.date).toLocaleDateString()}</p>
                    <p><strong>Category:</strong> {ach.category}</p>
                    <p><strong>Submitted by:</strong> {ach.studentUsername}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No achievements have been submitted to you yet.</p>
                <p>Share your username with students so they can submit their achievements!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>  
  );
}