import dotenv from 'dotenv';
dotenv.config();

import { runInvestmentSequence } from './services/langchainService.js';

async function test() {
  console.log('Testing LangChain sequence with Gemini API Key from .env for TSLA...');
  const profile = { sector: 'Automotive', industry: 'Electric Vehicles' };
  const metrics = { marketCap: 570000000000, peRatio: 65.2, eps: 1.2, revenue: 96000000000 };
  const news = [
    { title: 'TSLA Earnings Decline', source: 'Bloomberg', url: '#', sentiment: 'NEGATIVE' },
    { title: 'TSLA Gigafactory Growth Expansion', source: 'Reuters', url: '#', sentiment: 'POSITIVE' }
  ];

  try {
    const report = await runInvestmentSequence('TSLA', profile, metrics, news, 'Analyze production capacity');
    console.log('Report generated successfully!');
    console.log(JSON.stringify(report, null, 2));
  } catch (err) {
    console.error('Sequence failed with error:', err.message);
  }
}

test();
