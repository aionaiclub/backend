const express = require('express');
const { createRegistration, getMyRegistrations, getEventRegistrations } = require('../controllers/registrationController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createRegistration);

router.route('/my')
  .get(protect, getMyRegistrations);

router.route('/event/:eventId')
  .get(protect, superAdmin, getEventRegistrations);

module.exports = router;
