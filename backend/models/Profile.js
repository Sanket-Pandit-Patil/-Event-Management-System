const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Profile name is required'],
    trim: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Profile', ProfileSchema);
