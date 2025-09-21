import React, { useState } from "react";
import "./StudentHome.css";
import Navbar from "../Navbar/Navbar";

// ✅ Get username directly from localStorage
const loggedInUser = localStorage.getItem("username") || "";

export default function StudentHome() {
  const [formData, setFormData] = useState({
    achievementName: "",
    position: "",
    description: "",
    date: "",
    category: "",
    teacherUsername: "",
    certificate: null,
    studentUsername: loggedInUser, // ✅ use localStorage value directly
  });

  const handleLogout = () => {
    alert("You have been logged out!");
    window.location.href = "/"; //Redirect to login/home page
  }

  // handle text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle file input
  const handleFileChange = (e) => {
    setFormData({ ...formData, certificate: e.target.files[0] });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("achievementName", formData.achievementName);
    data.append("position", formData.position);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("category", formData.category);
    data.append("teacherUsername", formData.teacherUsername);
    data.append("certificate", formData.certificate);

    // ✅ Add studentUsername
    data.append("studentUsername", loggedInUser);

    try {
      const res = await fetch("http://localhost:5000/student/achievement", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        alert("✅ Achievement submitted successfully!");
        console.log(result);
      } else {
        alert("❌ Error: " + result.error);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Failed to connect to backend");
    }
  };

  return (
  <div>
    <Navbar onLogout = {handleLogout} />
    <div className="student-container">
      <div className="student-box">
        <h2>🎓 Achievement Submission Form</h2>
        <p>Fill out your achievement details below</p>

        <form className="student-form" onSubmit={handleSubmit}>
          <label>Achievement Name</label>
          <input
            type="text"
            name="achievementName"
            placeholder="Enter achievement name"
            value={formData.achievementName}
            onChange={handleChange}
            required
          />

          <label>Position / Rank</label>
          <input
            type="text"
            name="position"
            placeholder="e.g., 1st Place, Runner-up, Gold Medal, Winner"
            value={formData.position}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Brief description of the achievement"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>

          <label>Date of Achievement</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Category --</option>
            <option value="Academic">Academic</option>
            <option value="Sports">Sports</option>
            <option value="Cultural">Cultural</option>
            <option value="Technical">Technical</option>
            <option value="Other">Other</option>
          </select>

          <label>Upload Certificate</label>
          <input
            type="file"
            name="certificate"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
            required
          />

          <label>Teacher Username</label>
          <input
            type="text"
            name="teacherUsername"
            placeholder="Enter teacher's username"
            value={formData.teacherUsername}
            onChange={handleChange}
            required
          />

          {/* ✅ hidden field for student username */}
          <input
            type="hidden"
            name="studentUsername"
            value={formData.studentUsername}
            readOnly
          />

          <button type="submit">Submit Achievement</button>
        </form>
      </div>
    </div>
  </div>   
  );
}
