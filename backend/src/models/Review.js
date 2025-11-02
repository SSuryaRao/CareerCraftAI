const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userPicture: {
    type: String,
    default: null
  },
  userRole: {
    type: String,
    trim: true,
    default: 'User'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 100
  },
  review: {
    type: String,
    required: true,
    trim: true,
    minlength: 50,
    maxlength: 1000
  },
  aspectRatings: {
    features: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    support: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    easeOfUse: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  isVerifiedUser: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  helpfulCount: {
    type: Number,
    default: 0,
    min: 0
  },
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  adminNotes: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  teamResponse: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  responseDate: {
    type: Date,
    default: null
  },
  platform: {
    type: String,
    enum: ['web', 'mobile', 'desktop'],
    default: 'web'
  },
  approvedAt: {
    type: Date,
    default: null
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      // Don't expose helpfulBy array publicly
      if (ret.helpfulBy) {
        delete ret.helpfulBy;
      }
      return ret;
    }
  }
});

// Indexes for efficient queries
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ status: 1, isFeatured: -1, createdAt: -1 });
reviewSchema.index({ rating: -1, helpfulCount: -1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ status: 1, rating: -1 });

// Ensure only one review per user (unique compound index)
reviewSchema.index({ userId: 1 }, { unique: true });

// Virtual for average aspect rating
reviewSchema.virtual('avgAspectRating').get(function() {
  const aspects = this.aspectRatings;
  const ratings = [
    aspects.features,
    aspects.support,
    aspects.easeOfUse,
    aspects.valueForMoney
  ].filter(r => r !== null);

  if (ratings.length === 0) return null;
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
});

// Methods
reviewSchema.methods.approve = function(adminId) {
  this.status = 'approved';
  this.approvedAt = new Date();
  this.approvedBy = adminId;
  this.rejectedAt = null;
  this.rejectedBy = null;
  return this.save();
};

reviewSchema.methods.reject = function(adminId) {
  this.status = 'rejected';
  this.rejectedAt = new Date();
  this.rejectedBy = adminId;
  this.approvedAt = null;
  this.approvedBy = null;
  this.isFeatured = false;
  return this.save();
};

reviewSchema.methods.toggleFeatured = function() {
  if (this.status !== 'approved') {
    throw new Error('Only approved reviews can be featured');
  }
  this.isFeatured = !this.isFeatured;
  return this.save();
};

reviewSchema.methods.addTeamResponse = function(response, adminId) {
  this.teamResponse = response;
  this.respondedBy = adminId;
  this.responseDate = new Date();
  return this.save();
};

reviewSchema.methods.markHelpful = function(userId) {
  if (this.helpfulBy.includes(userId)) {
    // Remove if already marked
    this.helpfulBy = this.helpfulBy.filter(id => id.toString() !== userId.toString());
    this.helpfulCount = Math.max(0, this.helpfulCount - 1);
  } else {
    // Add if not marked
    this.helpfulBy.push(userId);
    this.helpfulCount += 1;
  }
  return this.save();
};

// Statics
reviewSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $facet: {
        total: [{ $count: 'count' }],
        approved: [
          { $match: { status: 'approved' } },
          { $count: 'count' }
        ],
        pending: [
          { $match: { status: 'pending' } },
          { $count: 'count' }
        ],
        avgRating: [
          { $match: { status: 'approved' } },
          { $group: { _id: null, avg: { $avg: '$rating' } } }
        ],
        ratingDistribution: [
          { $match: { status: 'approved' } },
          { $group: { _id: '$rating', count: { $sum: 1 } } },
          { $sort: { _id: -1 } }
        ],
        aspectRatings: [
          { $match: { status: 'approved' } },
          {
            $group: {
              _id: null,
              features: { $avg: '$aspectRatings.features' },
              support: { $avg: '$aspectRatings.support' },
              easeOfUse: { $avg: '$aspectRatings.easeOfUse' },
              valueForMoney: { $avg: '$aspectRatings.valueForMoney' }
            }
          }
        ]
      }
    }
  ]);

  const total = stats[0].total[0]?.count || 0;
  const approved = stats[0].approved[0]?.count || 0;
  const avgRating = stats[0].avgRating[0]?.avg || 0;

  return {
    total,
    approved,
    pending: stats[0].pending[0]?.count || 0,
    rejected: total - approved - (stats[0].pending[0]?.count || 0),
    avgRating: Math.round(avgRating * 10) / 10,
    ratingDistribution: stats[0].ratingDistribution.reduce((acc, item) => {
      acc[`${item._id}star`] = item.count;
      return acc;
    }, {}),
    aspectRatings: stats[0].aspectRatings[0] || {
      features: 0,
      support: 0,
      easeOfUse: 0,
      valueForMoney: 0
    },
    recommendationRate: total > 0 ? Math.round((approved / total) * 100) : 0
  };
};

reviewSchema.statics.getFeaturedReviews = function(limit = 5) {
  return this.find({ status: 'approved', isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-helpfulBy -adminNotes');
};

reviewSchema.statics.getApprovedReviews = function(options = {}) {
  const { page = 1, limit = 10, sort = '-createdAt', minRating = 1 } = options;

  return this.find({
    status: 'approved',
    rating: { $gte: minRating }
  })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-helpfulBy -adminNotes');
};

module.exports = mongoose.model('Review', reviewSchema);
