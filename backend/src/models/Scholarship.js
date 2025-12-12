const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  provider: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: String,
    required: true,
    trim: true
  },
  eligibility: {
    type: String,
    required: true,
    trim: true
  },
  deadline: {
    type: Date,
    required: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['UG', 'PG', 'Research', 'General', 'Women', 'Minority', 'Merit-based', 'Need-based', 'Internship'],
    default: 'General'
  },
  domain: {
    type: String,
    enum: ['Engineering', 'Medical', 'Arts', 'Science', 'Commerce', 'Law', 'General'],
    default: 'General'
  },
  trending: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Optimized indexes for faster searches
// Index for filtered queries (category, domain)
scholarshipSchema.index({ category: 1, domain: 1, active: 1 });
// Index for deadline-based sorting (common)
scholarshipSchema.index({ deadline: 1, active: 1 });
// Index for trending scholarships
scholarshipSchema.index({ trending: -1, deadline: 1, active: 1 });
// Compound index for personalized recommendations query (most important!)
scholarshipSchema.index({ active: 1, trending: -1, deadline: 1, createdAt: -1 });
// Index for domain filtering
scholarshipSchema.index({ active: 1, domain: 1 });
// Text index for search functionality (if needed later)
scholarshipSchema.index({ title: 'text', provider: 'text', eligibility: 'text' });

module.exports = mongoose.model('Scholarship', scholarshipSchema);