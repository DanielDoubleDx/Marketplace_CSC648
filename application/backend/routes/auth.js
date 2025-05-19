const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/database');

// Register
router.post("/register", async (req, res) => {
  const { fullName, email, username, password, confirmPassword } = req.body;

  if (!fullName || !email || !username || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const checkUser = "SELECT * FROM users WHERE email = ? OR username = ?";
    const results = await pool.query(checkUser, [email, username]);
    
    if (results.length > 0) {
      return res.status(409).json({ error: "Email or username already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertUser = "INSERT INTO users (full_name, email, username, password) VALUES (?, ?, ?, ?)";
    await pool.query(insertUser, [fullName, email, username, hashedPassword]);
    
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
  console.log("Login attempt with:", { identifier });

  if (!identifier || !password) {
    return res.status(400).json({ error: "Email/Username and password are required" });
  }

  try {
    const sql = "SELECT * FROM users WHERE email = ? OR username = ?";
    const results = await pool.query(sql, [identifier, identifier]);
    console.log("Raw database query results:", results);

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email/username or password" });
    }

    const user = results[0];
    console.log("Extracted user object:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email/username or password" });
    }

    const responseData = {
      message: "Login successful",
      user: {
        id: user.uuid,
        uuid: user.uuid,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
      },
    };
    console.log("Sending response:", responseData);

    return res.status(200).json(responseData);
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

module.exports = router; 