// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // to serve uploaded files

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "authdb",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

// ====================== REGISTER ======================
app.post("/register", (req, res) => {
  const { firstName, lastName, username, password, role } = req.body;

  if (!firstName || !lastName || !username || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // ✅ Check if username exists
  const checkSql = "SELECT * FROM users WHERE username = ?";
  db.query(checkSql, [username], (err, result) => {
    // if (err) {
    //   console.error("Error checking username:", err);
    //   return res.status(500).json({ error: "Database error" });
    // }

    if (result.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Insert new user
    const sql =
      "INSERT INTO users (first_name, last_name, username, password, role) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [firstName, lastName, username, password, role], (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({
        message: "User registered successfully",
        userId: result.insertId,
      });
    });
  });
});


// ====================== LOGIN ======================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Error checking user:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }

    if (result.length === 0) {
      // ❌ No user found with these credentials
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const user = result[0];

    // ✅ Success
    res.json({
      success: true,
      role: user.role,
      username: user.username,
    });
  });
});



// ====================== MULTER SETUP ======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // all certs stored inside uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  },
});

const upload = multer({ storage });

// ====================== ACHIEVEMENT SUBMISSION ======================
app.post("/student/achievement", upload.single("certificate"), (req, res) => {
  const {
    achievementName,
    position,
    description,
    date,
    category,
    teacherUsername,
    studentUsername,
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Certificate file is required" });
  }

  console.log("📩 Achievement received:", req.body);

  const certificateFile = req.file.path.replace(/\\/g, "/");

  const sql = `
    INSERT INTO achievements 
    (achievementName, position, description, date, category, teacherUsername, studentUsername, certificate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      achievementName,
      position,
      description,
      date,
      category,
      teacherUsername,
      studentUsername,
      certificateFile,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting achievement:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({
        message: "✅ Achievement submitted successfully",
        id: result.insertId,
      });
    }
  );
});

// ====================== GET TEACHER'S ACHIEVEMENTS ======================
app.get("/teacher/achievements/:username", (req, res) => {
  const { username } = req.params;

  const sql = `
    SELECT id, achievementName, position, description, date, category, certificate, studentUsername
    FROM achievements
    WHERE teacherUsername = ?
  `;

  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error("Error fetching achievements:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ====================== START SERVER ======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
