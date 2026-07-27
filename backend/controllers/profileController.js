const Profile = require('../models/Profile');

// @desc    Get all user profiles
// @route   GET /api/profiles
const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({}).sort({ name: 1 });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new user profile
// @route   POST /api/profiles
const createProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Profile name is required' });
    }

    const trimmedName = name.trim();
    const existingProfile = await Profile.findOne({ 
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } 
    });

    if (existingProfile) {
      return res.status(400).json({ message: 'Profile with this name already exists' });
    }

    const profile = await Profile.create({ name: trimmedName });
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfiles,
  createProfile
};
