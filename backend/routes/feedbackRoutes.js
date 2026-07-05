// =========================================================
// routes/feedbackRoutes.js
// Defines the API endpoints related to feedback and links
// them to their corresponding controller functions.
// =========================================================

const express = require("express");
const router = express.Router();
const { createFeedback, getAllFeedback } = require("../controllers/feedbackController");

// POST /api/feedback  -> Submit new feedback
router.post("/", createFeedback);

// GET /api/feedback   -> Get all feedback (latest first)
router.get("/", getAllFeedback);

module.exports = router;