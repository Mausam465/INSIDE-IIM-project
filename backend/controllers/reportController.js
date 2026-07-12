import * as reportService from '../services/reportService.js';
import { fetchFinancialData } from '../services/financeService.js';
import { fetchLatestNews } from '../services/newsService.js';
import { runInvestmentSequence } from '../services/langchainService.js';
import { searchCompanyInMarket } from '../services/companyService.js';

// @desc    Generate and save a report (AI Analysis Pipeline)
// @route   POST /api/reports
// @access  Private
export const generateReport = async (req, res) => {
  const { ticker, query } = req.body;

  try {
    if (!ticker || !query) {
      return res.status(400).json({ message: 'Ticker and query are required' });
    }

    // 0. Validate stock ticker or company name using market intelligence quotes index
    console.log(`Verifying market listing for input symbol/name: "${ticker}"...`);
    const matches = await searchCompanyInMarket(ticker);
    if (!matches || matches.length === 0) {
      return res.status(400).json({
        message: `Invalid company symbol or name "${ticker}". No listed market asset found. Please try a valid ticker (e.g. AAPL, TSLA, NVDA) or clear company name.`
      });
    }

    // Resolve input to matching listed equity data
    const resolvedTicker = matches[0].ticker;
    const resolvedName = matches[0].companyName;
    console.log(`Resolved "${ticker}" to listed asset: ${resolvedTicker} (${resolvedName})`);

    // 1. Fetch Financial Data
    const financials = await fetchFinancialData(resolvedTicker);

    // 2. Fetch Latest News
    const newsArticles = await fetchLatestNews(resolvedTicker);

    // Map news format to DB report schema expected keys (headline, source, url, sentiment, publishedAt)
    const dbNews = newsArticles.map((article) => {
      let sentiment = 'NEUTRAL';
      const titleLower = (article.title || '').toLowerCase();
      if (titleLower.includes('surge') || titleLower.includes('growth') || titleLower.includes('gain') || titleLower.includes('rise') || titleLower.includes('dividend') || titleLower.includes('buyback') || titleLower.includes('up') || titleLower.includes('positive') || titleLower.includes('launch') || titleLower.includes('deal')) {
        sentiment = 'POSITIVE';
      } else if (titleLower.includes('fall') || titleLower.includes('drop') || titleLower.includes('decline') || titleLower.includes('loss') || titleLower.includes('risk') || titleLower.includes('down') || titleLower.includes('headwind') || titleLower.includes('warn') || titleLower.includes('probe')) {
        sentiment = 'NEGATIVE';
      }

      return {
        headline: article.title,
        source: article.source,
        url: article.url || '#',
        sentiment: article.sentiment || sentiment,
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date()
      };
    });


    // 3. Execute LangChain Synthesis Sequence
    const analysis = await runInvestmentSequence(
      resolvedTicker,
      financials.profile,
      financials.metrics,
      newsArticles,
      query
    );

    // 4. Save structured dossier to MongoDB using reportService
    const reportData = {
      ticker: resolvedTicker.toUpperCase().trim(),
      companyName: resolvedName,
      companyOverview: financials.profile,
      financialData: financials.metrics,
      latestNews: dbNews,
      aiSummary: analysis.aiSummary,
      risks: analysis.risks,
      opportunities: analysis.opportunities,
      recommendation: analysis.recommendation, // strictly 'INVEST' or 'PASS'
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
