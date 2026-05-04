const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL to the image
  },
}, {
  timestamps: true,
});

const Achievement = mongoose.model('Achievement', achievementSchema);
module.exports = Achievement;
