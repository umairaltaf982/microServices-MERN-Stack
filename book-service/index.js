const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Define Routes
app.use('/api/books', require('./routes/books'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Book Service is running');
});

// Start server
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Book Service running on http://localhost:${PORT}`);
});
