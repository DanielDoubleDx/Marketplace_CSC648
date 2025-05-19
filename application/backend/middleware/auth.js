const pool = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
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

module.exports = { authenticateToken }; 