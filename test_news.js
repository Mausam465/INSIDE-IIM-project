import { fetchLatestNews } from './backend/services/newsService.js';

async function testNewsService() {
  console.log('Testing newsService.js...');
  try {
    const data = await fetchLatestNews('AAPL');
    console.log('Parsed News Articles Count:', data.length);
    console.log('First News Article Sample:');
    console.log(JSON.stringify(data[0], null, 2));
    console.log('News Service verification succeeded!');
  } catch (error) {
    console.error('News Service verification failed:', error.message);
  }
}

testNewsService();
