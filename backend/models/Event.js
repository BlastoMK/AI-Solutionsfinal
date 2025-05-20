const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: String,
  imageUrl: String,
  capacity: Number,
  ratings: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    value: { type: Number, min: 1, max: 5 }
  }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    approved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  registrations: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: String,
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    registeredAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Event', eventSchema);