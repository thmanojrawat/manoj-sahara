import Feedback from "../models/Feedback.js";

// POST /api/feedback
export const createFeedback = async (req, res) => {
  try {
    const authData = typeof req.auth === "function" ? req.auth() : req.auth;
    const userId = authData?.userId || null;

    const { name, email, rating, category, message } = req.body;

    if (!name || !rating || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, rating, and message are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const feedback = await Feedback.create({
      name,
      email: email ? email.toLowerCase().trim() : null,
      userId,
      rating: Number(rating),
      category: category || "Other",
      message,
    });

    res.status(201).json({
      success: true,
      message: "Thank you for your feedback!",
      data: { id: feedback._id },
    });
  } catch (err) {
    console.error("[Feedback] createFeedback error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to submit feedback" });
  }
};

// GET /api/feedback (Admin/CRM)
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: feedbacks });
  } catch (err) {
    console.error("[Feedback] getAllFeedback error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch feedback" });
  }
};
