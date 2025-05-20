// models/Enquiry.js
const enquirySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    phone: {
      type: String,
      validate: {
        validator: v => /^\+?[\d\s-]{10,}$/.test(v),
        message: 'Please enter a valid phone number'
      }
    },
    company: { type: String, required: true },
    country: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobDetails: { type: String, required: true, minlength: 20 },
    rating: { 
      type: Number, 
      min: 1, 
      max: 5,
      set: v => Math.round(v) // Ensure whole numbers
    },
    status: { 
      type: String, 
      enum: ['new', 'in_progress', 'resolved'], 
      default: 'new',
      index: true // For faster queries
    },
    createdAt: { type: Date, default: Date.now, index: true }
  }, {
    timestamps: true // Adds createdAt and updatedAt
  });