const express = require("express");
const pool = require("../config/database");
const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Database test route
router.get("/db-test", (req, res) => {
  pool.query("SELECT 1 + 1 AS result", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Database connected!", results });
  });
});
module.exports = router;