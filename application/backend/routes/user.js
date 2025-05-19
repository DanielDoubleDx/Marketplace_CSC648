const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get user info
router.get("/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const userQuery = "SELECT uuid, username, email, full_name, about_me FROM users WHERE uuid = ?";
    const userResults = await pool.query(userQuery, [uuid]);

    if (userResults.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResults[0];

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

    return res.status(200).json({
      message: "User Found",
      seller: {
        ...user,
        rating: "0.0",
      },
      products: listingsResults,
    });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Update user info
router.put("/update", authenticateToken, async (req, res) => {
  try {
    const { email, full_name, phone, address } = req.body;
    
    if (email) {
      const checkEmail = "SELECT * FROM users WHERE email = ? AND id != ?";
      const [existingUser] = await pool.query(checkEmail, [email, req.user.id]);
      if (existingUser.length > 0) {
        return res.status(409).json({ error: "Email already exists" });
      }
    }

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

    const getUser = "SELECT * FROM users WHERE id = ?";
    const [updatedUser] = await pool.query(getUser, [req.user.id]);

    if (updatedUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

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

module.exports = router; 