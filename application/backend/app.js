const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Database test route
app.get("/api/db-test", (req, res) => {
  pool.query("SELECT 1 + 1 AS result", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Database connected!", results });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
