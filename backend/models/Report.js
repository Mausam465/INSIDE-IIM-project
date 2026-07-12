import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticker: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  financialData: {
    peRatio: { type: Number },
    marketCap: { type: Number },
    debtToEquity: { type: Number },
    revenue: { type: Number },
    netIncome: { type: Number },
    freeCashFlow: { type: Number }
  },
  latestNews: [
    {
      headline: { type: String, required: true },
      source: { type: String, required: true },
      url: { type: String, required: true }
    }
  ],
  aiSummary: {
    type: String,
    required: true
  },
  risks: {
    type: [String],
    default: []
  },
  opportunities: {
    type: [String],
    default: []
  },
  recommendation: {
    type: String,
    enum: ['STRONG_BUY', 'BUY', 'HOLD', 'SELL', 'STRONG_SELL', 'INVEST', 'PASS'],
    required: true,
    default: 'HOLD'
  },
  confidenceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  createdDate: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

// Optimization Indexes
reportSchema.index({ userId: 1 });
reportSchema.index({ ticker: 1 });
reportSchema.index({ createdDate: -1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;
