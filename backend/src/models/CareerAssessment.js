const mongoose = require('mongoose');

const careerAssessmentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  answers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  recommendations: [{
    domain: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    roles: [String],
    reasoning: String
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
careerAssessmentSchema.index({ userId: 1, completedAt: -1 });

const CareerAssessment = mongoose.model('CareerAssessment', careerAssessmentSchema);

module.exports = CareerAssessment;
