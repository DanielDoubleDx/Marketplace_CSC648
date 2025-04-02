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

// Databse connection to AWS RDS
db.connector((err) => {
  if (err) {
    console.error("RDS connection failed:", err);
    return;
  }
  console.log("Connected to AWS RDS database");
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
  let { category, query } = req.query; // Extract query parameters

  // Base SQL query - selects all listings and joins with categories
  let sql = `
  SELECT l.*, pc.categories as category_name
  FROM listings l
  JOIN products_categories pc ON l.categories = pc.index_id
  WHERE 1=1
  `;

  const params = []; // Array to hold parameterized values

  // Add category filter if provided
  if (category && category !== "default") {
    sql += ` AND l.categories = ?`; // Add condition to SQL
    params.push(parseInt(category)); // Add value to params array
  }

  // Add text search if provided
  if (query) {
    sql += ` AND (l.title LIKE ? OR l.product_desc LIKE ?)`;
    params.push(`%${query}%`); // %wildcards% for partial matches
    params.push(`%${query}%`);
  }

  // Execute query with parameterized values
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error executing search query:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Return results with count
    return res.status(200).json({
      count: results.length, // Number of items found
      items: results, // Array of matching listings
    });
  });
});

// Testing endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Starting the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
