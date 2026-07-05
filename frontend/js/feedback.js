// =========================================================
// feedback.js
// Handles:
//   1. Feedback form validation + submission (feedback.html)
//   2. Fetching & displaying submitted feedback (feedback-list.html)
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const feedbackForm = document.getElementById("feedbackForm");
  const feedbackContainer = document.getElementById("feedbackContainer");

  if (feedbackForm) {
    initFeedbackForm(feedbackForm);
  }

  if (feedbackContainer) {
    loadFeedbackList();
  }
});

// =========================================================
// 1. FEEDBACK FORM (feedback.html)
// =========================================================
function initFeedbackForm(form) {
  const formMessage = document.getElementById("formMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Gather form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const event = document.getElementById("event").value;
    const rating = document.getElementById("rating").value;
    const message = document.getElementById("message").value.trim();

    // ---------- FRONTEND VALIDATION ----------
    let isValid = true;
    isValid = validateField("name", name !== "", "Full name is required.") && isValid;
    isValid = validateField("email", isValidEmail(email), "Enter a valid email address.") && isValid;
    isValid = validateField("event", event !== "", "Please select an event.") && isValid;
    isValid = validateField("rating", rating !== "", "Please select a rating.") && isValid;
    isValid = validateField("message", message !== "", "Feedback message is required.") && isValid;

    if (!isValid) {
      showFormMessage("Please fix the highlighted errors and try again.", "error");
      return;
    }

    const payload = { name, email, event, rating: Number(rating), message };

    try {
      // Disable button while submitting to avoid duplicate submits
      const submitBtn = form.querySelector(".submit-btn");
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";

      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showFormMessage("✅ Feedback submitted successfully! Thank you.", "success");
        form.reset();
      } else {
        showFormMessage(data.message || "Something went wrong. Please try again.", "error");
      }

      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Feedback";
    } catch (error) {
      console.error("Error submitting feedback:", error);
      showFormMessage(
        "⚠️ Could not connect to the server. Make sure the backend is running on port 5000.",
        "error"
      );
      const submitBtn = form.querySelector(".submit-btn");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Feedback";
    }
  });

  // ---------- Helper: validate a single field & show/hide error ----------
  function validateField(fieldId, condition, errorMsg) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}Error`);
    const group = field.closest(".form-group");

    if (!condition) {
      errorEl.textContent = errorMsg;
      group.classList.add("invalid");
      return false;
    } else {
      errorEl.textContent = "";
      group.classList.remove("invalid");
      return true;
    }
  }

  // ---------- Helper: show top-level success/error banner ----------
  function showFormMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    // Auto-hide after a few seconds
    setTimeout(() => {
      formMessage.className = "form-message";
    }, 5000);
  }
}

// ---------- Helper: simple email regex validation ----------
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// =========================================================
// 2. SUBMITTED FEEDBACK LIST (feedback-list.html)
// =========================================================
async function loadFeedbackList() {
  const container = document.getElementById("feedbackContainer");
  const loadingMessage = document.getElementById("loadingMessage");
  const emptyMessage = document.getElementById("emptyMessage");

  try {
    const response = await fetch(`${API_BASE_URL}/feedback`);
    const data = await response.json();

    loadingMessage.style.display = "none";

    if (!data.success || !data.data || data.data.length === 0) {
      emptyMessage.style.display = "block";
      return;
    }

    // Build a card for each feedback entry
    data.data.forEach((fb) => {
      const card = document.createElement("div");
      card.className = "feedback-card";

      const stars = "⭐".repeat(fb.rating);
      const date = new Date(fb.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      card.innerHTML = `
        <h3>${escapeHTML(fb.name)}</h3>
        <p class="fb-event">${escapeHTML(fb.event)}</p>
        <p class="fb-rating">${stars} (${fb.rating}/5)</p>
        <p class="fb-message">"${escapeHTML(fb.message)}"</p>
        <div class="fb-footer">
          <span>${escapeHTML(fb.email)}</span>
          <span>${date}</span>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    loadingMessage.textContent =
      "⚠️ Could not load feedback. Make sure the backend server is running.";
  }
}

// ---------- Helper: prevent basic HTML injection when rendering user text ----------
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}