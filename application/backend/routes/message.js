const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get user messages
router.get("/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  if (!uuid) {
    return res.status(400).json({ error: "UUID is missing from parameter" });
  }
  try {
    const sql = `SELECT sender, receiver, sender_text, receiver_text FROM messaging WHERE receiver = ? OR sender = ?`;
    const results = await pool.query(sql, [uuid, uuid]);
    res.json(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Send message
router.post("/", async (req, res) => {
  const { sender, receiver, sender_text, receiver_text } = req.body;
  
  if (!sender || !receiver) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields sender and/or receiver. Both are required.",
    });
  }

  try {
    // Check if conversation exists
    const sql_check = `SELECT * FROM messaging WHERE sender = ? AND receiver = ?`;
    const results = await pool.query(sql_check, [sender, receiver]);
    
    if (results.length === 0) {
      // Create new conversation
      const sql = `INSERT INTO messaging (sender, receiver, sender_text, receiver_text) VALUES (?,?,?,?)`;
      await pool.query(sql, [sender, receiver, '', '']);
      console.log("New conversation created");
    }

    // Update message
    if (sender_text === undefined) {
      const new_receiver_text = receiver_text.replace('|','') + '|';
      const sql = `UPDATE messaging SET receiver_text = CONCAT(receiver_text, ?) WHERE receiver = ? AND sender = ?`;
      await pool.query(sql, [new_receiver_text, receiver, sender]);
    } else {
      const new_sender_text = sender_text.replace('|','') + '|';
      const sql = `UPDATE messaging SET sender_text = CONCAT(sender_text, ?) WHERE receiver = ? AND sender = ?`;
      await pool.query(sql, [new_sender_text, receiver, sender]);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router; 