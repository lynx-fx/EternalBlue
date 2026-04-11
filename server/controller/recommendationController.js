const Recommendation = require("../model/Recommendation");

exports.createRecommendation = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    if (!title || !description || !category || !location) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    const rec = await Recommendation.create({
      title,
      description,
      category,
      location,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, data: rec });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create recommendation" });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const recs = await Recommendation.find().populate("createdBy", "name email");
    res.status(200).json({ success: true, count: recs.length, data: recs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to retrieve recommendations" });
  }
};

exports.deleteRecommendation = async (req, res) => {
  try {
    const rec = await Recommendation.findById(req.params.id);
    if (!rec) {
      return res.status(404).json({ success: false, message: "Recommendation not found" });
    }
    await rec.deleteOne();
    res.status(200).json({ success: true, message: "Recommendation removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete recommendation" });
  }
};
