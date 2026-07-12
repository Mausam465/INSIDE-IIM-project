import mongoose from 'mongoose';

const newsArticleSchema = new mongoose.Schema({
  headline: {
    type: String,
    required: true,
    trim: true
  },
  source: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  sentiment: {
    type: String,
    enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'],
    required: true
  }
}, { _id: false });

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
  news: [newsArticleSchema],
  aiAnalysis: {
    type: String,
    required: true
  },
  investmentDecision: {
    type: String,
    enum: ['STRONG_BUY', 'BUY', 'HOLD', 'SELL', 'STRONG_SELL'],
    required: true,
    default: 'HOLD'
  },
  confidenceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  searchDate: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for query optimization
reportSchema.index({ userId: 1 });
reportSchema.index({ ticker: 1 });
reportSchema.index({ searchDate: -1 });
reportSchema.index({ userId: 1, ticker: 1 }); // Compound index for filtering user watchlists

const Report = mongoose.model('Report', reportSchema);

export default Report;
