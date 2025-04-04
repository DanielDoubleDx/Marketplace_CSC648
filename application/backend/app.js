const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection to AWS RDS
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Simple connection test
pool.getConnection((err, connection) => {
  if (err) {
    console.error("RDS connection failed:", err);
    return;
  }
  console.log("Connected to AWS RDS database");
  connection.release();
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

// API endpoint for search
app.get("/api/search", (req, res) => {
  let { category, query } = req.query;

  // Base SQL query
  let sql = `
  SELECT l.*, pc.categories as category_name
  FROM listings l
  JOIN products_categories pc ON l.categories = pc.index_id
  WHERE 1=1
  `;

  const params = [];

  // Add category filter if provided
  if (category && category !== "default") {
    sql += ` AND l.categories = ?`;
    params.push(parseInt(category));
  }

  // Add text search if provided
  if (query) {
    sql += ` AND (l.title LIKE ? OR l.product_desc LIKE ?)`;
    params.push(`%${query}%`);
    params.push(`%${query}%`);
  }

  // Execute query
  pool.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error executing search query:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Return results with count
    return res.status(200).json({
      count: results.length,
      items: results,
    });
  });
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Anything that doesn't match the above, send back the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Starting the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
