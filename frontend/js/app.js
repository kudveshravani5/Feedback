// =========================================================
// app.js - Shared logic used across all pages
// =========================================================

// Base URL of our backend API.
// Change this if you deploy the backend somewhere else.
const API_BASE_URL = "https://feedback-5wyo.onrender.com";

// ---------- MOBILE NAVBAR TOGGLE ----------
// Allows the hamburger icon to open/close the nav links on small screens.
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  // Dummy "Register" button behaviour on the Events page
  const registerButtons = document.querySelectorAll(".register-btn");
  registerButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("🎉 Registration successful! (This is a demo button)");
    });
  });
});