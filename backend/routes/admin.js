const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Event = require('../models/Event');

// Apply auth and admin middleware to all admin routes
router.use(auth);
router.use(admin);

// Admin event management
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// In your backend routes (e.g., routes/admin.js)
router.post('/events', async (req, res) => {
  try {
    const { title, date, description, maxAttendees, location } = req.body;
    
    // Validate input
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    // Insert into database
    const result = await db.run(
      'INSERT INTO events (title, date, description, max_attendees, location) VALUES (?, ?, ?, ?, ?)',
      [title, date, description, maxAttendees, location]
    );

    // Return the created event
    const newEvent = {
      id: result.lastID,
      title,
      date,
      description,
      maxAttendees,
      location,
      registrations: 0,
      status: 'Upcoming'
    };

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;