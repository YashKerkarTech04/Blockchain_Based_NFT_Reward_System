import React, { useEffect, useState } from "react";
import "./PendingAchievements.css";

export default function PendingAchievements() {
  const [pendingAchievements, setPendingAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPendingAchievements();
  }, []);

  const fetchPendingAchievements = async () => {
    try {
      const studentUsername = localStorage.getItem("username");
      if (!studentUsername) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/student/achievements/pending/${studentUsername}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch pending achievements");
      }

      const data = await response.json();
      setPendingAchievements(data);
    } catch (err) {
      console.error("Error fetching pending achievements:", err);
      setError("Failed to load pending achievements");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "⏳ Pending", className: "status-pending" },
      approved: { label: "✅ Approved", className: "status-approved" },
      declined: { label: "❌ Declined", className: "status-declined" },
      revision_requested: { label: "✏️ Revision Needed", className: "status-revision" }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="achievements-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your pending achievements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="achievements-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Achievements</h3>
          <p>{error}</p>
          <button onClick={fetchPendingAchievements} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="achievements-page">
      <div className="page-header">
        <h2>⏳ Pending Achievements</h2>
        <p className="page-subtitle">
          Track the status of your submitted achievements. These are awaiting teacher approval.
        </p>
      </div>

      {pendingAchievements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Pending Achievements</h3>
          <p>You don't have any achievements waiting for approval.</p>
          <p>Submit new achievements to see them here!</p>
        </div>
      ) : (
        <>
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-number">{pendingAchievements.length}</span>
              <span className="stat-label">Pending Submissions</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {pendingAchievements.filter(ach => ach.teacherComment).length}
              </span>
              <span className="stat-label">With Teacher Comments</span>
            </div>
          </div>

          <div className="achievements-grid">
            {pendingAchievements.map((achievement) => (
              <div key={achievement.id} className="achievement-card">
                <div className="card-header">
                  <h3 className="achievement-title">{achievement.achievementName}</h3>
                  {getStatusBadge(achievement.status)}
                </div>

                <div className="card-content">
                  <div className="achievement-info">
                    <div className="info-row">
                      <span className="info-label">Position:</span>
                      <span className="info-value">{achievement.position}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Category:</span>
                      <span className={`category-tag ${achievement.category.toLowerCase()}`}>
                        {achievement.category}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Date:</span>
                      <span className="info-value">{formatDate(achievement.date)}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Teacher:</span>
                      <span className="info-value">{achievement.teacherUsername}</span>
                    </div>
                  </div>

                  <div className="description-section">
                    <h4>Description</h4>
                    <p>{achievement.description}</p>
                  </div>

                  {achievement.teacherComment && (
                    <div className="teacher-comment">
                      <h4>📝 Teacher's Comment</h4>
                      <p>{achievement.teacherComment}</p>
                    </div>
                  )}

                  <div className="proof-section">
                    <h4>Proof Submitted</h4>
                    <div className="proof-preview">
                      <img 
                        src={`http://localhost:5000/${achievement.certificate}`} 
                        alt="Achievement proof" 
                        className="proof-image"
                        onError={(e) => {
                          e.target.src = "/placeholder-certificate.jpg";
                        }}
                      />
                      <button 
                        className="view-proof-btn"
                        onClick={() => window.open(`http://localhost:5000/${achievement.certificate}`, '_blank')}
                      >
                        🔍 View Full Proof
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="submission-info">
                    Submitted on {formatDate(achievement.created_at || achievement.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}