const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const bcrypt = require("bcrypt");
const util = require("util");
require("dotenv").config();

const app = express();
app.use(cors());

const fs = require("fs"); // File system module

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Creating file with a unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Middleware

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
pool.query = util.promisify(pool.query);

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

// User registration
app.post("/api/register", async (req, res) => {
  const { fullName, email, username, password, confirmPassword } = req.body;
  console.log("Received registration:", req.body);

  // Basic validations
  if (!fullName || !email || !username || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    // Check if email or username already exists
    const checkUser = "SELECT * FROM users WHERE email = ? OR username = ?";
    pool.query(checkUser, [email, username], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length > 0) {
        return res.status(409).json({ error: "Email or username already exists" });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert user
      const insertUser = "INSERT INTO users (full_name, email, username, password) VALUES (?, ?, ?, ?)";
      pool.query(insertUser, [fullName, email, username, hashedPassword], (err, result) => {
        if (err) {
          console.error("Error inserting user:", err);
          return res.status(500).json({ error: "Database error" });
        }
        return res.status(201).json({ message: "User registered successfully" });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// User login with email OR username
app.post("/api/login", async (req, res) => {
  const { identifier, password } = req.body; // identifier = email or username
  console.log("Login attempt using:", identifier);

  if (!identifier || !password) {
    return res.status(400).json({ error: "Email/Username and password are required" });
  }

  try {
    const sql = "SELECT * FROM users WHERE email = ? OR username = ?";
    const results = await pool.query(sql, [identifier, identifier]);

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email/username or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email/username or password" });
    }

    // Success
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// listing ID image
app.get("/api/listings/:id/img", (req, res) => {
  const listingId = parseInt(req.params.id);
  const sql = "SELECT listing_img FROM listings WHERE id = ?";

  pool.query(sql, [listingId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }
    // Magic, come back to later for debugging
    imgPath = results[0].listing_img;
    res.sendFile(imgPath);
  });
});
// listing thumbnail
app.get("/api/listings/:id/thumbnail", (req, res) => {
  const listingId = parseInt(req.params.id);
  const sql = "SELECT thumbnail FROM listings WHERE id = ?";

  pool.query(sql, [listingId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }
    // Magic, come back to later for debugging
    thumbPath = results[0].thumbnail;
    res.sendFile(thumbPath);
  });
});
// don't delete yet till it has been approved by backend
/*app.post("/uploads", upload.single("image"), (req, res) => {
  console.log("Upload route hit!"); // Debug stuff
  console.log("Request file:", req.file); // Debug stuff
  console.log("Request body:", req.body); // Debug stuff

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const listingId = req.body.listingId;
  if (!listingId) {
    return res.status(400).json({ error: "Listing ID is required" });
  }

  // Get absolute path to the uploaded file
  const filePath = path.resolve(req.file.path);
  console.log("File uploaded to:", filePath);

  // Update database with absolute path
  const sql =
    "UPDATE listings SET listing_img = ?, thumbnail = ? WHERE listing_id = ?";
  pool.query(sql, [filePath, filePath, listingId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.status(200).json({ message: "Image uploaded successfully" });
  });
}); */

// API upload
app.post(["/uploads", "/api/listings/:id/upload"], upload.single("image"), (req, res) => {
  // Prefer param, fallback to body
  const listingId = parseInt(req.params.id || req.body.listingId);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  if (!listingId) {
    return res.status(400).json({ error: "Listing ID is required" });
  }

  const filePath = path.resolve(req.file.path);

  const sql =
    "UPDATE listings SET listing_img = ?, thumbnail = ? WHERE listing_id = ?";
  pool.query(sql, [filePath, filePath, listingId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.status(200).json({ message: "Image uploaded successfully" });
  });
});

// API endpoint for search
app.get("/api/search", (req, res) => {
  let { category, query } = req.query;

  // Base SQL query
  // Combining title and description for search
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

  // Add text search filter if provided, searchign title and description
  if (query) {
    // Searching for term in both title and description
    sql += ` AND (l.title LIKE ? OR l.product_desc LIKE ?)`;
    params.push(`%${query}%`); // Title Search
    params.push(`%${query}%`); // Description Search
  }

  // Execute query with parameterized values
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
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test API at: http://localhost:${PORT}/api/test`);
  console.log(`Database test at: http://localhost:${PORT}/api/db-test`);
});
