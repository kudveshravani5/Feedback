// =========================================================
// server.js
// Entry point of the backend application.
// Sets up Express, middleware, database connection, and routes.
// =========================================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const feedbackRoutes = require("./routes/feedbackRoutes");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors()); // Allow requests from the frontend (different origin/port)
app.use(bodyParser.json()); // Parse incoming JSON request bodies
app.use(express.json()); // Extra safety net for JSON parsing

// ---------- ROOT ROUTE ----------
// @desc  Simple welcome route to confirm the API is running
// @route GET /
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Event Feedback API" });
});

// ---------- FEEDBACK ROUTES ----------
// All feedback-related endpoints are prefixed with /api/feedback
app.use("/api/feedback", feedbackRoutes);

// ---------- 404 HANDLER ----------
// Catches any request to a route that doesn't exist
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ---------- GLOBAL ERROR HANDLER ----------
// Catches any errors thrown in route handlers that weren't already handled
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});