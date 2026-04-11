const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { 
  createReport, 
  getReports, 
  updateReportStatus 
} = require("../controller/reportController");

const router = express.Router();

router.route("/")
  .post(protect, createReport)
  .get(protect, adminOnly, getReports);

router.route("/:id")
  .put(protect, adminOnly, updateReportStatus);

module.exports = router;
