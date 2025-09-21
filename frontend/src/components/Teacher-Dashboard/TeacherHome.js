import React, { useEffect, useState } from "react";
import "./TeacherHome.css";
import Navbar from "../Navbar/Navbar";

export default function TeacherHome({ username }) {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/teacher/achievements/${username}`)
      .then((res) => res.json())
      .then((data) => setAchievements(data))
      .catch((err) => console.error("Error fetching achievements:", err));
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("username"); //clear the session
    alert("You have been logged out!");
    window.location.href = '/'; //redirect to home/login page
  }

  return (
  <div>
    <Navbar onLogout={handleLogout}/>
    <div className="teacher-container">
      <h2>📜 Achievements Sent To You</h2>
      <div className="card-container">
        {achievements.length > 0 ? (
            achievements.map((ach) => (
                <div key={ach.id} className="achievement-card">
                <img
                    src={`http://localhost:5000/${ach.certificate}`}
                    alt="certificate"
                />
                <div className="card-content">
                    <h3>{ach.achievementName}</h3>
                    <p><strong>Position:</strong> {ach.position}</p>
                    <p><strong>Description:</strong> {ach.description}</p>
                    <p><strong>Date:</strong> {ach.date}</p>
                    <p><strong>Category:</strong> {ach.category}</p>
                    <p><strong>Submitted by:</strong> {ach.studentUsername}</p>
                    <p><strong>Teacher:</strong> {ach.teacherUsername}</p>
                    <p><strong>ID:</strong> {ach.id}</p>
                </div>
                </div>
            ))
            ) : (
            <p>No achievements submitted yet.</p>
            )}

      </div>
    </div>
  </div>  
  );
}
