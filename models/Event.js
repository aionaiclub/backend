const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  date: {
    type: Date,
    required: true,
  },
  customFormFields: [
    {
      label: String,
      type: { type: String, enum: ['text', 'number', 'date', 'textarea'] },
      required: { type: Boolean, default: false }
    }
  ],
  materials: [
    {
      name: String,
      url: String,
      type: { type: String, enum: ['note', 'ppt', 'quiz', 'reference'] }
    }
  ],
  documents: [
    {
      name: String,
      url: String
    }
  ],
  liveStatus: {
    type: String,
    enum: ['inactive', 'active'],
    default: 'inactive'
  },
  currentSlide: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
