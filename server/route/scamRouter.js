const express = require("express");
const { addScam, getScamsByCountry, getAllScams, deleteScam } = require("../controller/scamController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/country/:country", protect, getScamsByCountry);
router.get("/", protect, getAllScams);
router.post("/", protect, adminOnly, addScam);
router.delete("/:id", protect, adminOnly, deleteScam);

module.exports = router;
