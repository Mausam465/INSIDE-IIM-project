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
  query: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  keyMetrics: {
    peRatio: Number,
    marketCap: Number,
    debtToEquity: Number,
    revenue: Number,
    profitMargin: Number
  },
  sentimentScore: {
    type: Number,
    min: -1.0,
    max: 1.0,
    default: 0.0
  },
  reportMarkdown: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
