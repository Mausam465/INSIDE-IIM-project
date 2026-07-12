import dotenv from 'dotenv';
dotenv.config();

import { runInvestmentSequence } from './services/langchainService.js';

async function test() {
  console.log('Testing LangChain sequence with Gemini API Key from .env...');
  const profile = { sector: 'Technology', industry: 'Consumer Electronics' };
  const metrics = { marketCap: 2890000000000, peRatio: 28.5, eps: 4.97, revenue: 383000000000 };
  const news = [
    { title: 'AAPL Surge', source: 'Market News', url: '#', sentiment: 'POSITIVE' }
  ];

  try {
    const report = await runInvestmentSequence('AAPL', profile, metrics, news, 'Analyze financial stability');
    console.log('Report generated successfully!');
    console.log(JSON.stringify(report, null, 2));
  } catch (err) {
    console.error('Sequence failed with error:', err.message);
  }
}

test();
