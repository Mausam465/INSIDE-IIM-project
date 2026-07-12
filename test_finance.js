import { fetchFinancialData } from './backend/services/financeService.js';

async function testFinanceService() {
  console.log('Testing financeService.js...');
  try {
    const data = await fetchFinancialData('AAPL');
    console.log('Parsed Financial Data:');
    console.log(JSON.stringify(data, null, 2));
    console.log('Finance Service verification succeeded!');
  } catch (error) {
    console.error('Finance Service verification failed:', error.message);
  }
}

testFinanceService();
