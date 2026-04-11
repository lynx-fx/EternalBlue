const router = require("express").Router();
const recommendationController = require("../controller/recommendationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public routes
router.get("/", recommendationController.getAllRecommendations);

// Admin routes
router.post("/", protect, adminOnly, recommendationController.createRecommendation);
router.put("/:id", protect, adminOnly, recommendationController.updateRecommendation);
router.delete("/:id", protect, adminOnly, recommendationController.deleteRecommendation);

module.exports = router;
