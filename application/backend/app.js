const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());



// Middleware

app.use(express.json());

app.use("/api", require("./routes/test"));

app.use("/api", require("./routes/product"));

app.use("/api", require("./routes/auth"));

app.use("/api", require("./routes/user"));

app.use("/api", require("./routes/message"));

/*
The search functionality is working as intended and reliably returns accurate results. 
The /api/search endpoint was tested using various combinations of title keywords and category filters. 
The function successfully returned the expected results, accurately filtering listings based on 
both the provided query, which matches the title and the category_name. The SQL query is parameterized, 
minimizing the risk of SQL injection, and the response includes both the item count and relevant listing data. 
*/



/// Serve uploaded images
app.use("./middleware/uploads", express.static(path.join(__dirname, "../uploads")));

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

