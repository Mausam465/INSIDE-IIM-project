import Report from '../models/Report.js';

// @desc    Generate a report (mocked output for now)
// @route   POST /api/reports/generate
// @access  Private
export const generateReport = async (req, res) => {
  const { ticker, query } = req.body;

  try {
    if (!ticker || !query) {
      return res.status(400).json({ message: 'Ticker and query are required' });
    }

    // Create a mock report for initial testing
    const mockReportMarkdown = `# Investment Research Report: ${ticker.toUpperCase()}
Generated on behalf of user: ${req.user.email}

## Executive Summary
This is a synthesized mock investment analysis report for **${ticker.toUpperCase()}** responding to the request: *"${query}"*.

## Financial Metrics Analysis
- Strong revenue trajectory
- Healthy balance sheet indicators

## Sentiment Summary
- Overall positive market sentiment derived from recent analyst reports.
`;

    const report = await Report.create({
      userId: req.user._id,
      ticker,
      query,
      summary: `Mock research report summary for ${ticker.toUpperCase()}`,
      keyMetrics: {
        peRatio: 28.5,
        marketCap: 2500000000000,
        debtToEquity: 1.2,
        revenue: 95000000000,
        profitMargin: 0.22
      },
      sentimentScore: 0.75,
      reportMarkdown: mockReportMarkdown
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports for authenticated user
// @route   GET /api/reports
// @access  Private
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
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
    const report = await Report.findOne({ _id: req.params.id, userId: req.user._id });

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
    const report = await Report.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!report) {
      return res.status(404).json({ message: 'Report not found or unauthorized' });
    }

    res.status(200).json({ message: 'Report removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
