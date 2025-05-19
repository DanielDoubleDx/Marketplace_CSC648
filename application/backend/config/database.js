const mysql = require("mysql2");
const util = require("util");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  connectTimeout: 60000, // Time to wait when establishing a new connection before throwing error
  acquireTimeout: 60000, // Time to wait for a connection from the pool
  timeout: 60000, // General timeout setting for connections
});

pool.query = util.promisify(pool.query);

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("RDS connection failed:", err);
    return;
  }
  console.log("Connected to AWS RDS database");
  connection.release();
});

module.exports = pool; 