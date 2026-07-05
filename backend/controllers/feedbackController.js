// =========================================================
// controllers/feedbackController.js
// Contains the business logic for handling feedback requests.
// Keeping this separate from routes follows the MVC pattern.
// =========================================================

const Feedback = require("../models/Feedback");

// Simple email regex used for backend validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------
// @desc    Create/submit new feedback
// @route   POST /api/feedback
// @access  Public
// ---------------------------------------------------------
exports.createFeedback = async (req, res) => {
  try {
    const { name, email, event, rating, message } = req.body;

    // ---------- BACKEND VALIDATION ----------
    // 1. Check all required fields are present
    if (!name || !email || !event || !rating || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, event, rating, message) are required.",
      });
    }

    // 2. Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // 3. Validate rating range
    const numericRating = Number(rating);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5.",
      });
    }

    // Create and save the feedback document
    const feedback = await Feedback.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      event: event.trim(),
      rating: numericRating,
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully!",
      data: feedback,
    });
  } catch (error) {
    // Handle Mongoose validation errors specifically
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    console.error("Error creating feedback:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while submitting feedback. Please try again later.",
    });
  }
};

// ---------------------------------------------------------
// @desc    Get all feedback (latest first)
// @route   GET /api/feedback
// @access  Public
// ---------------------------------------------------------
exports.getAllFeedback = async (req, res) => {
  try {
    // Sort by createdAt descending -> newest feedback appears first
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: feedbackList.length,
      data: feedbackList,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching feedback. Please try again later.",
    });
  }
};