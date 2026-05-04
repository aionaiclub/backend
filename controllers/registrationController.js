const Registration = require('../models/Registration');

// @desc    Register user for an event
// @route   POST /api/registrations
// @access  Private
const createRegistration = async (req, res) => {
  const { eventId, customAnswers } = req.body;

  try {
    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: eventId
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    const registration = new Registration({
      user: req.user._id,
      event: eventId,
      customAnswers
    });

    const createdRegistration = await registration.save();
    res.status(201).json(createdRegistration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's registrations
// @route   GET /api/registrations/my
// @access  Private
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event', 'title date liveStatus');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registrations for an event
// @route   GET /api/registrations/event/:eventId
// @access  Private/SuperAdmin
const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('user', 'name email');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRegistration, getMyRegistrations, getEventRegistrations };
