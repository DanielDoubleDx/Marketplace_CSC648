const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/database');

// Register route
router.post("/register", async (req, res) => {
  // Destructure the required fields from the request body
  const { fullName, email, username, password, confirmPassword } = req.body;

  // Check if all required fields are provided
  if (!fullName || !email || !username || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    // Check if email or username already exists in the database
    const checkUser = "SELECT * FROM users WHERE email = ? OR username = ?";
    const results = await pool.query(checkUser, [email, username]);
    
    if (results.length > 0) {
      return res.status(409).json({ error: "Email or username already exists" });
    }

    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const insertUser = "INSERT INTO users (full_name, email, username, password) VALUES (?, ?, ?, ?)";
    await pool.query(insertUser, [fullName, email, username, hashedPassword]);
    
    // Respond with success
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or username
  console.log("Login attempt with:", { identifier });

  // Check if both identifier and password are provided
  if (!identifier || !password) {
    return res.status(400).json({ error: "Email/Username and password are required" });
  }

  try {
    // Find user by email or username
    const sql = "SELECT * FROM users WHERE email = ? OR username = ?";
    const results = await pool.query(sql, [identifier, identifier]);
    console.log("Raw database query results:", results);

    // If no user found, return error
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email/username or password" });
    }

    const user = results[0];
    console.log("Extracted user object:", user);

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email/username or password" });
    }

    // Prepare the user data to send in response
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

// Logout route
router.post("/logout", (req, res) => {
  // For a stateless API, logout can be handled on client side by clearing tokens
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

module.exports = router; 