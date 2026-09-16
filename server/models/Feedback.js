import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },

    userId: {
      type: String,
      default: null,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Rating is required"],
    },

    category: {
      type: String,
      enum: [
        "Website Experience",
        "Property Search",
        "Property Details",
        "Site Visit",
        "Customer Support",
        "Other",
      ],
      default: "Other",
    },

    message: {
      type: String,
      required: [true, "Feedback message is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

feedbackSchema.index({ userId: 1 });
feedbackSchema.index({ category: 1 });
feedbackSchema.index({ rating: 1 });

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
