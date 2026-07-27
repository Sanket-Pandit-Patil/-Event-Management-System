const mongoose = require('mongoose');

const ChangeItemSchema = new mongoose.Schema({
  field: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  previousValue: {
    type: String
  },
  newValue: {
    type: String
  }
}, { _id: false });

const EventLogSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true
  },
  changes: [ChangeItemSchema],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EventLog', EventLogSchema);
