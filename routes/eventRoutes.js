const express = require('express');
const { getEvents, getEventById, createEvent, updateLiveStatus, deleteEvent, updateEvent } = require('../controllers/eventController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, superAdmin, createEvent);

router.route('/:id')
  .get(getEventById)
  .put(protect, superAdmin, updateEvent)
  .delete(protect, superAdmin, deleteEvent);

router.route('/:id/live')
  .put(protect, superAdmin, updateLiveStatus);

module.exports = router;
