import Rating from './models/Rating.js';

// Submit rating
app.post('/api/ratings', async (req, res) => {
  try {
    const rating = new Rating({
      ...req.body,
      userAgent: req.get('User-Agent')
    });
    await rating.save();
    res.status(201).json(rating);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all ratings (admin-only)
app.get('/api/admin/ratings', authenticateAdmin, async (req, res) => {
  const ratings = await Rating.find().sort({ createdAt: -1 });
  res.json(ratings);
});