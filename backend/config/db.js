// =========================================================
// config/db.js
// Handles the connection to MongoDB using Mongoose.
// =========================================================

const mongoose = require("mongoose");

// connectDB() - Establishes a connection to MongoDB.
// Uses async/await so we can catch connection errors cleanly.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit the process with failure if the DB connection fails.
    // The server is useless without a database in this app.
    process.exit(1);
  }
};

module.exports = connectDB;