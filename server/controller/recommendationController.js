const Recommendation = require("../model/Recommendation");

exports.getAllRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find().sort({ createdAt: -1 });
    res.json({ success: true, data: recommendations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createRecommendation = async (req, res) => {
  try {
    const recommendation = new Recommendation(req.body);
    await recommendation.save();
    res.status(201).json({ success: true, data: recommendation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recommendation) return res.status(404).json({ success: false, message: "Recommendation not found" });
    res.json({ success: true, data: recommendation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.findByIdAndDelete(req.params.id);
    if (!recommendation) return res.status(404).json({ success: false, message: "Recommendation not found" });
    res.json({ success: true, message: "Recommendation deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
