const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const util = require("util");
require("dotenv").config();

const app = express();
app.use(cors());

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
  charset: "utf8mb4",
  connectTimeout: 60000, // Add this (60 seconds)
  acquireTimeout: 60000, // Add this (60 seconds)
  timeout: 60000, // Add this (60 seconds)
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

app.get("/api/listings/:listing_id", async (req, res) => {
  const listing_id = req.params.listing_id;
  const sql = `SELECT * FROM listings WHERE listing_id = ?`
  pool.query(sql, listing_id, (err, result) => {
    if (err) 
      return res.status(500).json({ error: err.message });
    res.status(200).json(result);
  });
});

// Replace your current /api/user/:uuid endpoint with this:
app.get("/api/user/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    // Step 1: Get the user information
    const userQuery =
      "SELECT uuid, username, email, full_name, about_me FROM users WHERE uuid = ?";
    const userResults = await pool.query(userQuery, [uuid]);

    if (userResults.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResults[0];

    // Step 2: Get user's listings
    const listingsQuery = `
      SELECT 
        l.listing_id, 
        l.title, 
        l.product_desc, 
        l.price, 
        l.created_at,
        l.thumbnail, 
        l.listing_img,
        l.categories,
        pc.categories as category_name
      FROM 
        listings l
      LEFT JOIN 
        products_categories pc ON l.categories = pc.index_id
      WHERE 
        l.seller_id = ?
    `;
    const listingsResults = await pool.query(listingsQuery, [uuid]);

    // Default rating
    const defaultRating = "0.0";

    // Combine the results
    return res.status(200).json({
      message: "User Found",
      seller: {
        ...user,
        rating: defaultRating,
      },
      products: listingsResults,
    });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Server error" });
  }
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
        return res
          .status(409)
          .json({ error: "Email or username already exists" });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert user
      const insertUser =
        "INSERT INTO users (full_name, email, username, password) VALUES (?, ?, ?, ?)";
      pool.query(
        insertUser,
        [fullName, email, username, hashedPassword],
        (err, result) => {
          if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ error: "Database error" });
          }
          return res
            .status(201)
            .json({ message: "User registered successfully" });
        }
      );
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
    return res
      .status(400)
      .json({ error: "Email/Username and password are required" });
  }

  try {
    const sql = "SELECT * FROM users WHERE email = ? OR username = ?";
    const results = await pool.query(sql, [identifier, identifier]);

    if (results.length === 0) {
      return res
        .status(401)
        .json({ error: "Invalid email/username or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Invalid email/username or password" });
    }

    // Success
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.uuid,
        uuid: user.uuid,
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

// User logout
app.post("/api/logout", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// listing ID image
// app.get("/api/listings/:id/img", (req, res) => {
//   const listingId = parseInt(req.params.id);
//   const sql = "SELECT listing_img FROM listings WHERE listing_id = ?";

//   pool.query(sql, [listingId], (err, results) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ error: "Database error" });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ error: "Listing not found" });
//     }
//     const imgPath = results[0].listing_img;
//     const resolvePath = path.resolve(imgPath);

//     if (!fs.existsSync(resolvePath)) {
//       return res.status(404).json({ error: "Image not found" });
//     }
//     // Magic, come back to later for debugging

//     res.sendFile(resolvePath);
//   });
// });

// // listing thumbnail
// app.get("/api/listings/:id/thumbnail", (req, res) => {
//   const listingId = parseInt(req.params.id);
//   const sql = "SELECT thumbnail FROM listings WHERE listing_id = ?";

//   pool.query(sql, [listingId], (err, results) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ error: "Database error" });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ error: "Listing not found" });
//     }
//     const thumbPath = results[0].thumbnail;
//     const resolvePath = path.resolve(thumbPath);
//     if (!fs.existsSync(resolvePath)) {
//       return res.status(404).json({ error: "Thumbnail not found" });
//     }
//     // Magic, come back to later for debugging

//     res.sendFile(resolvePath);
//   });
// });
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

// Add this endpoint to your backend server file

// Send the users messages, HAS NO SECURITY!!! 
app.get("/api/messaging/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  if (!uuid) {
    return res.status(400).json({ error: "UUID is missing from parameter" });
  }
  const sql = `SELECT sender, receiver, sender_text, receiver_text FROM messaging WHERE receiver = ? OR sender = ?
  `;
  pool.query(sql, [uuid, uuid], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return;
    }
    res.json(results);
  });
});

app.post("/api/messaging", async (req, res) => {
  const { sender, receiver , sender_text, receiver_text } = req.body;
  
  if(!sender || !receiver ) {
    return res.status(400).json({
      success: false,
      error:
        "Missing required fields sender and/or reciever. Both are required.",
    });
  }
  console.log(sender_text);
  console.log(receiver_text);

  const sql_check = `SELECT * FROM messaging WHERE sender = ? AND receiver = ?`
  pool.query(sql_check, [sender, receiver], (err, results) => {
    if(results.length === 0) {
      const sql = `INSERT INTO messaging (sender, receiver, sender_text, receiver_text) VALUES (?,?,?,?)`;
      pool.query(sql, [sender, receiver, '', ''], (err, results) => {
        if(results.affectedRows === 0) {
          console.log("insertion failed, returning early");
          return;
        }
        console.log("New Row Created");
      });
    }
  });

  if(sender_text === undefined) {
    new_receiver_text = receiver_text.replace('|','') + '|';
    console.log(new_receiver_text);
    const sql = `UPDATE messaging SET receiver_text = CONCAT(receiver_text, ?) WHERE receiver = ? AND sender = ?`;
    pool.query(sql, [new_receiver_text, receiver, sender], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return;
      }
      console.log('Rows affected:', results.affectedRows);
    });
    return res.sendStatus(200);
  }
  new_sender_text = sender_text.replace('|','') + '|';
  console.log(new_sender_text);
  const sql = `UPDATE messaging SET sender_text = CONCAT(sender_text, ?) WHERE receiver = ? AND sender = ?`;
  pool.query(sql, [new_sender_text, receiver, sender], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }
    console.log('Rows affected:', results.affectedRows);
  });
  res.sendStatus(200);
});

app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT index_id, categories AS category_name FROM products_categories ORDER BY index_id');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create new product listing
app.post("/api/listings", async (req, res) => {
  // Extract listing details from request body
  const { title, product_desc, price, categories, seller_uuid } = req.body;

  // Basic validation
  if (!title || !product_desc || !price || !categories || !seller_uuid) {
    return res.status(400).json({
      success: false,
      error:
        "Missing required fields. Title, description, price, category, and seller ID are required.",
    });
  }

  try {
    // Validate seller exists
    const sellerQuery = "SELECT uuid FROM users WHERE uuid = ?";
    const sellerResults = await pool.query(sellerQuery, [seller_uuid]);

    if (sellerResults.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Seller not found. Please provide a valid seller ID.",
      });
    }

    // Validate category exists
    const categoryQuery =
      "SELECT index_id FROM products_categories WHERE categories = ?";
    const categoryResults = await pool.query(categoryQuery, [categories]);

    if (categoryResults.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Category not found. Please provide a valid category ID.",
      });
    }

    // Default values for images (can be updated later via the upload endpoint)
    const thumbnail = null;
    const listing_img = null;

    // Insert the new listing
    const insertQuery = `
      INSERT INTO listings (
        title, 
        product_desc, 
        price, 
        categories, 
        seller_id,
        thumbnail,
        listing_img,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const result = await pool.query(insertQuery, [
      title,
      product_desc,
      price,
      categoryResults,
      seller_uuid,
      thumbnail,
      listing_img,
    ]);

    // Return success with the new listing ID
    return res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing_id: result.insertId,
    });
  } catch (err) {
    console.error("Error creating listing:", err);
    return res.status(500).json({
      success: false,
      error: "Server error while creating listing",
    });
  }
});

// API upload
app.post(
  ["/uploads", "/api/listings/:id/upload"],
  upload.single("image"),
  (req, res) => {
    // Prefer param, fallback to body
    const listingId = parseInt(req.params.id || req.body.listingId);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!listingId) {
      return res.status(400).json({ error: "Listing ID is required" });
    }

    const relativePath = `/uploads/${req.file.filename}`;

    const sql =
      "UPDATE listings SET listing_img = ?, thumbnail = ? WHERE listing_id = ?";
    pool.query(sql, [relativePath, relativePath, listingId], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Listing not found" });
      }

      res.status(200).json({ message: "Image uploaded successfully" });
    });
  }
);

// API endpoint for search
app.get("/api/search", (req, res) => {
  // Extract category and query parameters from the request
  let { category, query } = req.query;

  // Base SQL query
  // Combining title and description for search
  let sql = `
  SELECT l.*,
  pc.categories AS category_name,
  u.uuid AS seller_uuid
  FROM listings l
  JOIN products_categories pc ON l.categories = pc.index_id
  JOIN users u ON l.seller_id = u.uuid
  WHERE 1=1
`;

  /*
  It is good to use  parameterized queries to prevent SQL injection.
  However, I recommend validating inputs like category and query to ensure 
  they are the expected types and avoid errors or inefficient queries.
  */

  const params = [];

  // Add category filter if provided
  if (category && category !== "default") {
    // I would recommend validating that category is a valid integer before using it in the query.
    sql += ` AND l.categories = ?`;
    params.push(parseInt(category));
  }

  // Add text search filter if provided, searchign title and description
  if (query) {
    // Searching for term in both title and description

    /* I suggest trimming the query string and limiting its length
     to avoid overly broad searches that can slow down the database.
    */
    sql += ` AND (l.title LIKE ? OR l.product_desc LIKE ?)`;
    params.push(`%${query}%`); // Title Search
    params.push(`%${query}%`); // Description Search
  }

  // You can consider to add pagination, which is LIMIT and OFFSET to avoid large result sets.

  // Execute query with parameterized values
  pool.query(sql, params, (err, results) => {
    // I think it will be good to avoid showing raw database errors to the client.
    // Instead, I log the errors on the server and send a simple error message to the client.
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
/*
The search functionality is working as intended and reliably returns accurate results. 
The /api/search endpoint was tested using various combinations of title keywords and category filters. 
The function successfully returned the expected results, accurately filtering listings based on 
both the provided query, which matches the title and the category_name. The SQL query is parameterized, 
minimizing the risk of SQL injection, and the response includes both the item count and relevant listing data. 
*/

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

/// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Add this line here to serve React static files
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Always keep this at the very bottom
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

// Middleware to authenticate token
const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Extract user information from token
    const userQuery = "SELECT * FROM users WHERE id = ?";
    const [user] = await pool.query(userQuery, [token.split('_')[1]]);
    
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user[0];
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Update user information
app.put("/api/user/update", authenticateToken, async (req, res) => {
  try {
    const { email, full_name, phone, address } = req.body;
    
    // Check if the new email already exists (if email is being changed)
    if (email) {
      const checkEmail = "SELECT * FROM users WHERE email = ? AND id != ?";
      const [existingUser] = await pool.query(checkEmail, [email, req.user.id]);
      if (existingUser.length > 0) {
        return res.status(409).json({ error: "Email already exists" });
      }
    }

    // Update user info in the database
    const updateUser = `
      UPDATE users 
      SET email = ?, 
          full_name = ?, 
          phone = ?, 
          address = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    await pool.query(updateUser, [
      email,
      full_name,
      phone,
      address,
      req.user.id
    ]);

    // Retrieve updated user info
    const getUser = "SELECT * FROM users WHERE id = ?";
    const [updatedUser] = await pool.query(getUser, [req.user.id]);

    if (updatedUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the updated user information
    return res.json({
      id: updatedUser[0].id,
      email: updatedUser[0].email,
      username: updatedUser[0].username,
      full_name: updatedUser[0].full_name,
      phone: updatedUser[0].phone,
      address: updatedUser[0].address,
      created_at: updatedUser[0].created_at,
      updated_at: updatedUser[0].updated_at
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});
