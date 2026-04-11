const mongoose = require("mongoose");

const scamSchema = new mongoose.Schema(
  {
    country: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    severity: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scam", scamSchema);
