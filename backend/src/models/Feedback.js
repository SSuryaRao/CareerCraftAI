const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  type: {
    type: String,
    enum: ['bug', 'feature_request', 'general', 'improvement', 'complaint'],
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['ui_ux', 'performance', 'feature', 'content', 'other'],
    required: true,
    index: true
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 150
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 2000
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: null
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  pageUrl: {
    type: String,
    trim: true,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'in-progress', 'resolved', 'archived'],
    default: 'pending',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    index: true
  },
  adminNotes: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  adminResponse: {
    type: String,
    maxlength: 2000,
    default: ''
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  respondedAt: {
    type: Date,
    default: null
  },
  sentiment: {
    score: {
      type: Number,
      min: -1,
      max: 1,
      default: null
    },
    magnitude: {
      type: Number,
      min: 0,
      default: null
    },
    label: {
      type: String,
      enum: ['positive', 'neutral', 'negative', 'mixed', null],
      default: null
    }
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  resolvedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for efficient queries
feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ status: 1, priority: -1, createdAt: -1 });
feedbackSchema.index({ type: 1, category: 1 });
feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ email: 1 });

// Virtual for age in days
feedbackSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Methods
feedbackSchema.methods.markAsResolved = function(adminId) {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  this.respondedBy = adminId;
  return this.save();
};

feedbackSchema.methods.addResponse = function(response, adminId) {
  this.adminResponse = response;
  this.respondedBy = adminId;
  this.respondedAt = new Date();
  return this.save();
};

// Statics
feedbackSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $facet: {
        total: [{ $count: 'count' }],
        byStatus: [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        byType: [
          { $group: { _id: '$type', count: { $sum: 1 } } }
        ],
        byPriority: [
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ],
        avgRating: [
          { $match: { rating: { $ne: null } } },
          { $group: { _id: null, avg: { $avg: '$rating' } } }
        ],
        sentiment: [
          { $match: { 'sentiment.label': { $ne: null } } },
          { $group: { _id: '$sentiment.label', count: { $sum: 1 } } }
        ]
      }
    }
  ]);

  return {
    total: stats[0].total[0]?.count || 0,
    byStatus: stats[0].byStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    byType: stats[0].byType.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    byPriority: stats[0].byPriority.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    avgRating: stats[0].avgRating[0]?.avg || 0,
    sentiment: stats[0].sentiment.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {})
  };
};

module.exports = mongoose.model('Feedback', feedbackSchema);
