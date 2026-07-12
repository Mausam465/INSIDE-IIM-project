import dotenv from 'dotenv';
dotenv.config();

import { fetchFinancialData } from './services/financeService.js';

async function test() {
  console.log('Testing real-time finance service extraction inside backend context...');
  try {
    const data = await fetchFinancialData('AAPL');
    console.log('Result data:');
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Test error:', err.message);
  }
}

test();
