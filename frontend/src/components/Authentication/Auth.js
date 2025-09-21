import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Auth() {
  const [tab, setTab] = useState("register"); 
  const [role, setRole] = useState("student"); // role selection only for registration
  const navigate = useNavigate();

  // form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  // handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // submit register form
  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          password: formData.password,
          role: role,
        }),
      });
      const data = await res.json();

      if(!res.ok){
        alert("Error: "+data.error);
        return; //stop execution
      }
        alert("✅ Registered successfully!");
        setTab("login"); // switch to login after registration
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Failed to connect to backend");
    }
  };

  // submit login form
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // ❌ Backend rejected login (wrong credentials or wrong role)
        alert("❌ " + (data.error || "Login failed"));
        return; // stop further execution
      }

      if (!data.success) {
        alert("❌ " + (data.error || "Login failed"));
        return;
      }

      // ✅ login successful
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      // Navigate based on backend role
      if (data.role === "teacher") {
        navigate("/teacher-home", { state: { username: data.username } });
      } else if (data.role === "student") {
        navigate("/student-home", { state: { username: data.username } });
      } else {
        alert("❌ Invalid role received from backend");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Failed to connect to backend");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{tab === "login" ? "Welcome Back" : "Create Account"}</h2>
        <p>
          {tab === "login"
            ? "Sign in to your account"
            : `Register as a ${role}`}
        </p>

        {/* Role Toggle - only for registration */}
        {tab === "register" && (
          <div className="role-toggle">
            <button
              className={role === "student" ? "active" : ""}
              onClick={() => setRole("student")}
            >
              Student
            </button>
            <button
              className={role === "teacher" ? "active" : ""}
              onClick={() => setRole("teacher")}
            >
              Teacher
            </button>
          </div>
        )}

        {/* Login Form */}
        {tab === "login" && (
          <form className="auth-form" onSubmit={handleLogin}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={loginData.username}
              onChange={handleLoginChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />

            <p className="signup-text">
              Don't have an account?{" "}
              <span onClick={() => setTab("register")}>Sign up</span>
            </p>

            <button type="submit">Login</button>
          </form>
        )}

        {/* Register Form */}
        {tab === "register" && (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="name-fields">
              <div>
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <p className="signup-text">
              Already have an account?{" "}
              <span onClick={() => setTab("login")}>Login</span>
            </p>

            <button type="submit">Register as {role}</button>
          </form>
        )}
      </div>
    </div>
  );
}
