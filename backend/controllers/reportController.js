import * as reportService from '../services/reportService.js';
import { fetchFinancialData } from '../services/financeService.js';
import { fetchLatestNews } from '../services/newsService.js';
import { runInvestmentSequence } from '../services/langchainService.js';

// @desc    Generate and save a report (AI Analysis Pipeline)
// @route   POST /api/reports
// @access  Private
export const generateReport = async (req, res) => {
  const { ticker, query } = req.body;

  try {
    if (!ticker || !query) {
      return res.status(400).json({ message: 'Ticker and query are required' });
    }

    // 1. Fetch Financial Data
    const financials = await fetchFinancialData(ticker);

    // 2. Fetch Latest News
    const newsArticles = await fetchLatestNews(ticker);

    // Map news format to DB report schema expected keys (headline, source, url)
    const dbNews = newsArticles.map((article) => ({
      headline: article.title,
      source: article.source,
      url: article.url
    }));

    // 3. Execute LangChain Synthesis Sequence
    const analysis = await runInvestmentSequence(
      ticker,
      financials.profile,
      financials.metrics,
      newsArticles,
      query
    );

    // 4. Save structured dossier to MongoDB using reportService
    const reportData = {
      ticker: ticker.toUpperCase().trim(),
      companyName: financials.companyName,
      financialData: financials.metrics,
      latestNews: dbNews,
      aiSummary: analysis.aiSummary,
      risks: analysis.risks,
      opportunities: analysis.opportunities,
      recommendation: analysis.recommendation,
      confidenceScore: analysis.confidenceScore
    };

    const report = await reportService.saveReport(req.user._id, reportData);

    res.status(201).json(report);
  } catch (error) {
    console.error(`Pipeline Error: ${error.stack}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports for authenticated user
// @route   GET /api/reports
// @access  Private
export const getReports = async (req, res) => {
  try {
    const reports = await reportService.getReportsHistory(req.user._id);
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get report details
// @route   GET /api/reports/:id
// @access  Private
export const getReportById = async (req, res) => {
  try {
    const report = await reportService.getReportById(req.params.id, req.user._id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private
export const deleteReport = async (req, res) => {
  try {
    const deleted = await reportService.deleteReport(req.params.id, req.user._id);

    if (!deleted) {
      return res.status(404).json({ message: 'Report not found or unauthorized' });
    }

    res.status(200).json({ message: 'Report removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
