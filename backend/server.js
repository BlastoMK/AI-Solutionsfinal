require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');

// Initialize Express and Socket.io
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
app.use(morgan('dev'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-solutions')
  .then(() => {
    console.log('✔ Connected to MongoDB');
    console.log('✔ Database:', mongoose.connection.db.databaseName);
  })
  .catch(err => console.error('✖ MongoDB connection error:', err));

// ========================
// MODELS
// ========================

const ratingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 200
  },
  pageUrl: {
    type: String,
    required: true
  },
  userAgent: String
}, {
  timestamps: true
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const contactFormSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  status: { type: String, default: 'New' },
  createdAt: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  maxAttendees: { type: Number, required: true },
  location: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Registration' }]
}, { timestamps: true });

const registrationSchema = new mongoose.Schema({
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event',
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  phone: String,
  company: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: String,
  company: String,
  country: String,
  jobTitle: String,
  requirements: {
    type: String,
    required: true
  },
  repliedAt: Date,
  replySubject: String,
  replyContent: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Rating = mongoose.model('Rating', ratingSchema);
const User = mongoose.model('User', userSchema);
const ContactForm = mongoose.model('ContactForm', contactFormSchema);
const Event = mongoose.model('Event', eventSchema);
const Registration = mongoose.model('Registration', registrationSchema);
const Enquiry = mongoose.model('Enquiry', enquirySchema);


// ========================
// AUTH MIDDLEWARE
// ========================

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ========================
// EVENT ROUTES
// ========================

app.post('/api/admin/events', authenticateAdmin, async (req, res) => {
  try {
    const event = new Event({ ...req.body, createdBy: req.user.id });
    const savedEvent = await event.save();
    
    await logActivity(
      'event_created',
      'event',
      savedEvent._id,
      'admin',
      { title: savedEvent.title }
    );
    
    io.emit('event-created', savedEvent);
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/events', authenticateAdmin, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/events/:id', authenticateAdmin, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    io.emit('event-updated', updatedEvent);
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/events/:id', authenticateAdmin, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    io.emit('event-deleted', deletedEvent._id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ========================
// ACTIVITY MODEL
// ========================
const activitySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['event_created', 'event_updated', 'event_deleted', 
           'rating_submitted', 'enquiry_submitted', 'registration_created',
           'enquiry_replied']
  },
  entityType: {
    type: String,
    required: true,
    enum: ['event', 'rating', 'enquiry', 'registration']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  performedBy: {
    type: String,
    required: true,
    enum: ['admin', 'user']
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Activity = mongoose.model('Activity', activitySchema);

// ========================
// ACTIVITY LOGGER
// ========================
const logActivity = async (action, entityType, entityId, performedBy, metadata = {}) => {
  try {
    const activity = new Activity({
      action,
      entityType,
      entityId,
      performedBy,
      metadata
    });
    
    await activity.save();
    io.emit('new-activity', activity);
    
    console.log(`Activity logged: ${action}`);
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
};

// Get all activities
app.get('/api/admin/activities', authenticateAdmin, async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(100);
      
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get activities by type
app.get('/api/admin/activities/:type', authenticateAdmin, async (req, res) => {
  try {
    const activities = await Activity.find({ entityType: req.params.type })
      .sort({ createdAt: -1 })
      .limit(100);
      
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ========================
// REGISTRATION ROUTES (Updated)
// ========================

// Regular user registration
app.post('/api/registrations', async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
    
    await Event.findByIdAndUpdate(
      req.body.eventId,
      { $push: { registrations: registration._id } }
    );
    
    io.emit('new-registration', registration);
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin registration routes (grouped with authentication)
app.use('/api/admin/registrations', authenticateAdmin, (req, res, next) => {
  // This middleware will run for all /api/admin/registrations routes
  next();
});

// Get all registrations (admin)
app.get('/api/admin/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find()
      .sort({ createdAt: -1 })
      .populate('eventId', 'title date');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete registration (admin)
app.delete('/api/admin/registrations/:id', async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    // Remove from event's registrations array
    await Event.findByIdAndUpdate(
      registration.eventId,
      { $pull: { registrations: registration._id } }
    );
    
    io.emit('registration-deleted', req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ 
      message: 'Failed to delete registration',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


// ========================
//  EVENT ROUTES
// ========================
// Get all events (for landing page)
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 })
      .lean();
    
    // Add formatted date and image
    const eventsWithImages = events.map(event => ({
      ...event,
      formattedDate: new Date(event.date).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }),
      cover: event.cover || getDefaultImage(event.title)
    }));

    res.json(eventsWithImages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

    app.get('/api/events/latest', async (req, res) => {
  const events = await Event.find()
    .sort({ date: -1 })
    .limit(3)
    .lean();
  
  // Ensure every event has a cover image
  const validatedEvents = events.map(event => ({
    ...event,
    cover: event.cover || 'default.jpg' // Fallback
  }));
  
  res.json(validatedEvents);
});

// Get latest 3 non-expired events
app.get('/api/events/latest', async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find({
      date: { $gte: now } // Only future events
    })
    .sort({ date: 1 }) // Nearest date first
    .limit(3);
    
    res.json(events.map(event => ({
      ...event._doc,
      formattedDate: new Date(event.date).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper function for default images
function getDefaultImage(title) {
  if (title.includes("AI")) return "/images/events/ai-event.jpg";
  if (title.includes("Workshop")) return "/images/events/workshop.jpg";
  return "/images/events/default.jpg";
}

// Admin event creation
app.post('/api/admin/events', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, date, maxAttendees, location } = req.body;
    
    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      maxAttendees,
      location,
      registrations: [],
      cover: getDefaultImage(title),
      createdAt: new Date()
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Search endpoint
app.get('/api/events/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);

    const events = await Event.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ date: 1 })
    .limit(12)
    .lean();

    res.json(events.map(event => ({
      ...event,
      formattedDate: new Date(event.date).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================
// RATING ROUTES
// ========================

app.post('/api/ratings', async (req, res) => {
  try {
    const rating = new Rating(req.body);
    const savedRating = await rating.save();
    
    await logActivity(
      'rating_submitted',
      'rating',
      savedRating._id,
      'user',
      { rating: savedRating.rating }
    );
    
    io.emit('new-rating', savedRating);
    res.json({ success: true, message: 'Rating submitted!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/ratings', authenticateAdmin, async (req, res) => {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/admin/ratings/:id', authenticateAdmin, async (req, res) => {
  try {
    const deletedRating = await Rating.findByIdAndDelete(req.params.id);
    if (!deletedRating) {
      return res.status(404).json({ error: 'Rating not found' });
    }
    
    res.json({ message: 'Rating deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ========================
// ADMIN ROUTES
// ========================

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: 'admin' });
    
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ========================
// ENQUIRY ROUTES
// ========================

app.post('/api/enquiries', async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    
    io.emit('new-enquiry', enquiry);
    res.status(201).json({ message: 'Enquiry submitted successfully' });
  } catch (err) {
    res.status(400).json({ 
      error: 'Failed to submit enquiry',
      details: err.message 
    });
  }
});

app.get('/api/admin/enquiries', authenticateAdmin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/enquiries/:id', authenticateAdmin, async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enquiry deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/enquiries/:id/reply', authenticateAdmin, async (req, res) => {
  try {
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      {
        repliedAt: new Date(),
        replySubject: req.body.subject,
        replyContent: req.body.content
      },
      { new: true }
    );
    
    // In a real application, you would send an email here
    // await sendEmail({
    //   to: updatedEnquiry.email,
    //   subject: req.body.subject,
    //   text: req.body.content
    // });
    
    res.json({ message: 'Reply sent successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// ========================
// CONTACT ROUTES
// ========================

app.post('/api/contact', async (req, res) => {
  try {
    const contactForm = new ContactForm(req.body);
    await contactForm.save();
    io.emit('new-inquiry', contactForm);
    res.status(201).json({ success: true, message: 'Thank you for your message!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/inquiries', authenticateAdmin, async (req, res) => {
  try {
    const inquiries = await ContactForm.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Optional: Add to admin routes
app.get('/api/admin/enquiries', authenticateAdmin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ========================
// STATS ROUTE
// ========================

app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const [enquiries, events, registrations, ratings] = await Promise.all([
      Enquiry.countDocuments(),
      Event.countDocuments(),
      Registration.countDocuments(),
      Rating.countDocuments()
    ]);

    res.json({ 
      enquiries,
      events, 
      registrations,
      ratings,
      activity: enquiries + registrations // Example activity metric
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// ========================
// SOCKET.IO CONNECTION
// ========================

io.on('connection', (socket) => {
  console.log('⚡️ Admin client connected:', socket.id);
  
  socket.on('subscribe', (room) => {
    socket.join(room);
    console.log(`📡 Admin joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Admin client disconnected:', socket.id);
  });
});

// ========================
// SERVER START
// ========================

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🔗 Admin login endpoint: http://localhost:${PORT}/api/admin/login`);
  console.log(`🔒 JWT secret length: ${process.env.JWT_SECRET?.length || 0} characters`);
  console.log(`📡 Socket.io ready for connections\n`);
  console.log(`🌟 Rating endpoint: http://localhost:${PORT}/api/ratings`);
  console.log(`🌟 Events endpoint: http://localhost:${PORT}/api/admin/events`);
 console.log(`📊 Stats endpoint: http://localhost:${PORT}/api/admin/stats\n`);
  console.log(`📩 Contact endpoint: http://localhost:${PORT}/api/contact`);
  console.log(`📝 Registration endpoint: http://localhost:${PORT}/api/registrations`);
});