const Event = require('../models/Event');
const Profile = require('../models/Profile');
const EventLog = require('../models/EventLog');
const { calculateEventDiff } = require('../utils/diffCalculator');

// @desc    Get all events (optional profile filter)
// @route   GET /api/events
const getEvents = async (req, res) => {
  try {
    const { profileId } = req.query;
    let query = {};

    if (profileId) {
      query.profiles = profileId;
    }

    const events = await Event.find(query)
      .populate('profiles', 'name')
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
const createEvent = async (req, res) => {
  try {
    const { profiles, timezone, startTime, endTime } = req.body;

    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
      return res.status(400).json({ message: 'Please select at least one profile.' });
    }

    if (!timezone) {
      return res.status(400).json({ message: 'Timezone is required.' });
    }

    if (!startTime || !endTime) {
      return res.status(400).json({ message: 'Start date/time and end date/time are required.' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end < start) {
      return res.status(400).json({ message: 'End date/time cannot be in the past relative to the selected start date/time.' });
    }

    const event = await Event.create({
      profiles,
      timezone,
      startTime: start,
      endTime: end
    });

    const populatedEvent = await Event.findById(event._id).populate('profiles', 'name');
    res.status(201).json(populatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an existing event
// @route   PUT /api/events/:id
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { profiles, timezone, startTime, endTime } = req.body;

    const oldEvent = await Event.findById(id);
    if (!oldEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
      return res.status(400).json({ message: 'Please select at least one profile.' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end < start) {
      return res.status(400).json({ message: 'End date/time cannot be in the past relative to the selected start date/time.' });
    }

    // Fetch all profiles involved for diff calculation (names)
    const allProfileIds = Array.from(new Set([...oldEvent.profiles.map(p => p.toString()), ...profiles]));
    const profileDocs = await Profile.find({ _id: { $in: allProfileIds } });
    const profilesMap = {};
    profileDocs.forEach(p => {
      profilesMap[p._id.toString()] = p.name;
    });

    // Calculate diff before mutation
    const newEventData = {
      profiles,
      timezone,
      startTime: start,
      endTime: end
    };

    const changes = calculateEventDiff(oldEvent, newEventData, profilesMap, profilesMap);

    // Apply updates
    oldEvent.profiles = profiles;
    oldEvent.timezone = timezone;
    oldEvent.startTime = start;
    oldEvent.endTime = end;

    await oldEvent.save();

    // Log changes if any detected
    if (changes.length > 0) {
      // Create separate log entry for each change item or grouped change
      for (const change of changes) {
        await EventLog.create({
          eventId: oldEvent._id,
          changes: [change],
          timestamp: new Date()
        });
      }
    }

    const updatedEvent = await Event.findById(id).populate('profiles', 'name');
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get audit logs for an event
// @route   GET /api/events/:id/logs
const getEventLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await EventLog.find({ eventId: id }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  getEventLogs
};
