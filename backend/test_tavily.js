import dotenv from 'dotenv';
dotenv.config();

async function testTavily() {
  const apiKey = process.env.TAVILY_API_KEY;
  console.log('Tavily API Key loaded:', apiKey ? apiKey.substring(0, 15) + '...' : 'NONE');

  const query = 'AAPL stock current valuation Market Cap, P/E ratio, EPS, Revenue, Net Income';
  const url = 'https://api.tavily.com/search';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: 'basic'
      })
    });

    console.log('Response Status:', response.status);
    const data = await response.json();
    if (response.ok) {
      console.log('Tavily request succeeded! Results count:', (data.results || []).length);
      console.log('Sample content snippet:', data.results?.[0]?.content?.substring(0, 150));
    } else {
      console.error('Tavily request failed:', data);
    }
  } catch (err) {
    console.error('Network error during Tavily fetch:', err.message);
  }
}

testTavily();
