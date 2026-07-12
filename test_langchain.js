import { runInvestmentSequence } from './backend/services/langchainService.js';

async function testLangChainService() {
  console.log('Testing langchainService.js...');
  const profile = { sector: 'Technology', industry: 'Consumer Electronics' };
  const metrics = { marketCap: 2890000000000, peRatio: 28.5, eps: 4.97, revenue: 383000000000 };
  const news = [
    { title: 'AAPL Surge', source: 'Market News', url: '#', sentiment: 'POSITIVE' }
  ];

  try {
    const report = await runInvestmentSequence('AAPL', profile, metrics, news, 'Analyze financial stability');
    console.log('Generated Markdown Output:');
    console.log(report);
    console.log('LangChain Service verification succeeded!');
  } catch (error) {
    console.error('LangChain Service verification failed:', error.message);
  }
}

testLangChainService();
