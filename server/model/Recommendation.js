const mongoose = require("mongoose");

const RecommendationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['trip', 'hotel'], required: true },
  location: { type: String, required: true },
  price: { type: String },
  rating: { type: Number, default: 5 },
  imageUrl: { type: String },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Recommendation", RecommendationSchema);
