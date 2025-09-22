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
    e.target.src = "/placeholder-certificate.jpg";
  }

  // Button handlers
  const handleIssueBadge = (achievementId) => {
    alert(`Issuing badge for achievement ID: ${achievementId}`);
    // Implement badge issuing logic here
  }

  const handleDeclineRequest = async (achievementId) => {
  if (!window.confirm("Are you sure you want to decline this achievement request?")) return;

  const comment = prompt("Optional: add a comment for the student");

  try {
    const res = await fetch(`http://localhost:5000/teacher/achievement/${achievementId}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "declined",
        teacherComment: comment
      }),
    });

    const data = await res.json();
    alert(data.message);

    // Refresh achievements
    setAchievements(prev => prev.filter(a => a.id !== achievementId));
  } catch (err) {
    console.error(err);
    alert("Error performing action");
  }
};


const handleRequestChanges = async (achievementId) => {
  const comment = prompt("Describe what changes are needed:");
  if (!comment) return;

  try {
    const res = await fetch(`http://localhost:5000/teacher/achievement/${achievementId}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "revision_requested",
        teacherComment: comment
      }),
    });
    const data = await res.json();
    alert(data.message);
    // Optionally remove or update card
    setAchievements(prev => prev.filter(a => a.id !== achievementId));
  } catch (err) {
    console.error(err);
    alert("Error performing action");
  }
};


  const handleViewProof = (certificateUrl) => {
    window.open(`http://localhost:5000/${certificateUrl}`, '_blank');
  }

  return (
    <div className="teacher-home-container">
      <Navbar onLogout={handleLogout}/>
      <div className="teacher-container">
        <div className="header-section">
          <h2>📜 Achievements Sent To You</h2>
          <p className="subtitle">Review and manage student achievement submissions</p>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading achievements...</p>
          </div>
        ) : (
          <div className="card-container">
            {achievements.length > 0 ? (
              achievements.map((ach) => (
                <div key={ach.id} className="achievement-card">
                  <div className="card-header">
                    <h3>{ach.achievementName}</h3>
                    <span className={`category-tag ${ach.category.toLowerCase()}`}>
                      {ach.category}
                    </span>
                  </div>
                  
                  <div className="card-image">
                    <img
                      src={`http://localhost:5000/${ach.certificate}`}
                      alt="certificate"
                      onError={handleImageError}
                    />
                  </div>
                  
                  <div className="card-content">
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">Position:</span>
                        <span className="value">{ach.position}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Date:</span>
                        <span className="value">{new Date(ach.date).toLocaleDateString()}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Student:</span>
                        <span className="value">{ach.studentUsername}</span>
                      </div>
                    </div>
                    
                    <div className="description">
                      <p>{ach.description}</p>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => handleIssueBadge(ach.id)}
                    >
                      <span className="btn-icon">🎖️</span> Issue Badge
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => handleViewProof(ach.certificate)}
                    >
                      <span className="btn-icon">🔍</span> View Proof
                    </button>
                    <button 
                      className="btn-warning"
                      onClick={() => handleRequestChanges(ach.id)}
                    >
                      <span className="btn-icon">✏️</span> Request Changes
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={() => handleDeclineRequest(ach.id)}
                    >
                      <span className="btn-icon">❌</span> Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No achievements yet</h3>
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