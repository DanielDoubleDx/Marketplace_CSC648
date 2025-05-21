const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const upload = require('../middleware/upload');

// Get product by ID
router.get("/product/:listing_id", async (req, res) => {
  const listing_id = req.params.listing_id;
  try {
    const sql = `SELECT * FROM listings WHERE listing_id = ?`;
    const result = await pool.query(sql, listing_id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new product
router.post("/product", async (req, res) => {
  const { title, product_desc, price, categories, seller_uuid } = req.body;

  // Validate required fields
  if (!title || !product_desc || !price || !categories || !seller_uuid) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields. Title, description, price, category, and seller ID are required.",
    });
  }

  // Check if seller exists
  try {
    const sellerQuery = "SELECT uuid FROM users WHERE uuid = ?";
    const sellerResults = await pool.query(sellerQuery, [seller_uuid]);

    if (sellerResults.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Seller not found. Please provide a valid seller ID.",
      });
    }

    // Check if category exists
    const categoryQuery = "SELECT index_id FROM products_categories WHERE index_id = ?";
    const categoryResults = await pool.query(categoryQuery, [categories]);

    if (categoryResults.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Category not found. Please provide a valid category ID.",
      });
    }

    // Prepare insert query
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

    // Extract the category ID from the results
    const categoryIdToInsert = categoryResults[0].index_id;

    const result = await pool.query(insertQuery, [
      title,
      product_desc,
      price,
      categoryIdToInsert, // Use the extracted ID here
      seller_uuid,
      null, // Thumbnail will be added later
      null, // Image will be uploaded later
    ]);

    // Respond with success
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

// Upload product image
router.post("/:id/upload", upload.single("image"), async (req, res) => {
  const listingId = parseInt(req.params.id);

  // Check if file and listing ID are provided
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  if (!listingId) {
    return res.status(400).json({ error: "Listing ID is required" });
  }

  const relativePath = `/uploads/${req.file.filename}`;

  try {
    // Update listing with image path
    const sql = "UPDATE listings SET listing_img = ?, thumbnail = ? WHERE listing_id = ?";
    const result = await pool.query(sql, [relativePath, relativePath, listingId]);

    // Check if listing was found
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.status(200).json({ message: "Image uploaded successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const rows = await pool.query('SELECT categories AS category_name FROM products_categories ORDER BY index_id');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Search products
router.get("/search", async (req, res) => {
  let { category, query } = req.query;

  let sql = `
    SELECT l.*,
    pc.categories AS category_name,
    u.uuid AS seller_uuid
    FROM listings l
    JOIN products_categories pc ON l.categories = pc.index_id
    JOIN users u ON l.seller_id = u.uuid
    WHERE 1=1
  `;

  const params = [];

  // Filter by category if provided
  if (category && category !== "default") {
    sql += ` AND l.categories = ?`;
    params.push(parseInt(category));
  }

  // Filter by search keyword if provided
  if (query) {
    sql += ` AND (l.title LIKE ? OR l.product_desc LIKE ?)`;
    params.push(`%${query}%`);
    params.push(`%${query}%`);
  }

  try {
    // Execute the query with filters
    const results = await pool.query(sql, params);
    return res.status(200).json({
      count: results.length,
      items: results,
    });
  } catch (err) {
    console.error("Error executing search query:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

module.exports = router; 