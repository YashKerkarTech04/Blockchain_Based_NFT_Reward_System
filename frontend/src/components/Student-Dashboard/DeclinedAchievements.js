import React, { useEffect, useState } from "react";
import "./DeclinedAchievements.css";

export default function DeclinedAchievements() {
  const [declinedAchievements, setDeclinedAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDeclinedAchievements();
  }, []);

  const fetchDeclinedAchievements = async () => {
    try {
      const studentUsername = localStorage.getItem("username");
      if (!studentUsername) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/student/achievements/declined/${studentUsername}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch declined achievements");
      }

      const data = await response.json();
      setDeclinedAchievements(data);
    } catch (err) {
      console.error("Error fetching declined achievements:", err);
      setError("Failed to load declined achievements");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const handleResubmit = async (achievementId) => {
    if (window.confirm("Are you sure you want to resubmit this achievement? You can make changes before resubmitting.")) {
      // Here you can implement resubmission logic
      // For now, just show a message
      alert("Resubmission feature will be implemented soon!");
    }
  };

  const handleLearnMore = () => {
    alert("Contact your teacher for more details about why the achievement was declined and how you can improve your submission.");
  };

  if (loading) {
    return (
      <div className="declined-achievements-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading declined achievements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="declined-achievements-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Declined Achievements</h3>
          <p>{error}</p>
          <button onClick={fetchDeclinedAchievements} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="declined-achievements-page">
      <div className="page-header">
        <div className="header-content">
          <h2>❌ Declined Achievements</h2>
          <p className="page-subtitle">
            Review the achievements that were not approved by your teachers. Learn from the feedback to improve future submissions.
          </p>
        </div>
        <div className="header-actions">
          <button className="help-btn" onClick={handleLearnMore}>
            💡 Get Help
          </button>
        </div>
      </div>

      {declinedAchievements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎉</div>
          <h3>No Declined Achievements</h3>
          <p>Great news! You don't have any declined achievements.</p>
          <p>All your submissions have been approved or are still under review.</p>
        </div>
      ) : (
        <>
          <div className="stats-bar">
            <div className="stat-item declined-stat">
              <span className="stat-number">{declinedAchievements.length}</span>
              <span className="stat-label">Declined Submissions</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {declinedAchievements.filter(ach => ach.teacherComment).length}
              </span>
              <span className="stat-label">With Feedback</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {new Set(declinedAchievements.map(ach => ach.teacherUsername)).size}
              </span>
              <span className="stat-label">Different Teachers</span>
            </div>
          </div>

          <div className="declined-achievements-grid">
            {declinedAchievements.map((achievement) => (
              <div key={achievement.id} className="declined-card">
                <div className="card-header">
                  <div className="title-section">
                    <h3 className="achievement-title">{achievement.achievementName}</h3>
                    <span className="declined-badge">❌ Declined</span>
                  </div>
                  <div className="meta-info">
                    <span className="date-info">Submitted {getTimeAgo(achievement.created_at || achievement.date)}</span>
                  </div>
                </div>

                <div className="card-content">
                  <div className="basic-info">
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Position:</span>
                        <span className="info-value">{achievement.position}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Category:</span>
                        <span className={`category-tag ${achievement.category.toLowerCase()}`}>
                          {achievement.category}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Achievement Date:</span>
                        <span className="info-value">{formatDate(achievement.date)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Reviewed by:</span>
                        <span className="info-value teacher-name">{achievement.teacherUsername}</span>
                      </div>
                    </div>
                  </div>

                  <div className="description-section">
                    <h4>📋 Your Submission</h4>
                    <p>{achievement.description}</p>
                  </div>

                  <div className="declined-reason">
                    <div className="reason-header">
                      <h4>📝 Teacher's Feedback</h4>
                      <span className="feedback-icon">💬</span>
                    </div>
                    {achievement.teacherComment ? (
                      <div className="teacher-comment">
                        <p>{achievement.teacherComment}</p>
                        <div className="comment-meta">
                          Feedback provided on {formatDate(achievement.updated_at || achievement.date)}
                        </div>
                      </div>
                    ) : (
                      <div className="no-comment">
                        <p>No specific feedback provided by the teacher.</p>
                        <button className="contact-btn" onClick={handleLearnMore}>
                          Contact teacher for details
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="proof-section">
                    <h4>📎 Submitted Proof</h4>
                    <div className="proof-preview">
                      <img 
                        src={`http://localhost:5000/${achievement.certificate}`} 
                        alt="Achievement proof" 
                        className="proof-image"
                        onError={(e) => {
                          e.target.src = "/placeholder-certificate.jpg";
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="card-actions">
                  <button 
                    className="action-btn view-proof-btn"
                    onClick={() => window.open(`http://localhost:5000/${achievement.certificate}`, '_blank')}
                  >
                    🔍 View Proof
                  </button>
                  <button 
                    className="action-btn learn-more-btn"
                    onClick={handleLearnMore}
                  >
                    💡 Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="improvement-tips">
            <h4>💡 Tips for Better Submissions</h4>
            <div className="tips-grid">
              <div className="tip-item">
                <span className="tip-icon">📸</span>
                <div className="tip-content">
                  <h5>Clear Documentation</h5>
                  <p>Ensure your proof is clear, readable, and directly supports your achievement claim.</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-icon">📝</span>
                <div className="tip-content">
                  <h5>Detailed Description</h5>
                  <p>Provide specific details about what you accomplished and how you achieved it.</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-icon">👨‍🏫</span>
                <div className="tip-content">
                  <h5>Teacher Guidelines</h5>
                  <p>Follow any specific submission guidelines provided by your teacher.</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}