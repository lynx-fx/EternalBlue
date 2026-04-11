const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { 
  createRecommendation, 
  getRecommendations, 
  deleteRecommendation 
} = require("../controller/recommendationController");

const router = express.Router();

router.route("/")
  .get(protect, getRecommendations)
  .post(protect, adminOnly, createRecommendation);

router.route("/:id")
  .delete(protect, adminOnly, deleteRecommendation);

module.exports = router;
