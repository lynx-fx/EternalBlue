const express = require('express');
const router = express.Router();
const emergencyController = require('../controller/emergencyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:countryCode', protect, emergencyController.getEmergencyByCountry);

module.exports = router;
