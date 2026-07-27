const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    profiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
      }
    ],
    timezone: {
      type: String,
      required: [true, 'Timezone is required'],
      trim: true
    },
    startTime: {
      type: Date,
      required: [true, 'Start date and time are required']
    },
    endTime: {
      type: Date,
      required: [true, 'End date and time are required']
    }
  },
  {
    timestamps: true
  }
);

// Validate that end time is strictly equal to or after start time
EventSchema.pre('save', function (next) {
  if (this.endTime < this.startTime) {
    next(new Error('End date/time cannot be in the past relative to the selected start date/time.'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Event', EventSchema);
