import { generateReportAnalysis } from './backend/services/aiService.js';

async function testAIService() {
  console.log('Testing aiService.js...');
  const financials = {
    companyName: 'Apple Inc.',
    metrics: { peRatio: 28.5, marketCap: 2890000000000, debtToEquity: 1.1, revenue: 383000000000 }
  };
  const news = [
    { title: 'AAPL Surge', source: 'Market News', url: '#', sentiment: 'POSITIVE' }
  ];

  try {
    const report = await generateReportAnalysis('AAPL', financials, news, 'Analyze cash growth');
    console.log('Generated Decision:', report.investmentDecision);
    console.log('Confidence Score:', report.confidenceScore);
    console.log('Markdown Report Length:', report.reportMarkdown.length);
    console.log('AI Service verification succeeded!');
  } catch (error) {
    console.error('AI Service verification failed:', error.message);
  }
}

testAIService();
