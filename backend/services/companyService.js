/**
 * Company Search Service
 * Interacts with market intelligence lookup tools to match company name queries.
 */
export const searchCompanyInMarket = async (companyName) => {
  const query = encodeURIComponent(companyName.trim());
  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${query}&newsCount=0`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to query market data provider. Status: ${response.status}`);
    }

    const data = await response.json();

    // Map Yahoo Finance quotes results to a clean production structure
    const matches = (data.quotes || [])
      .filter((quote) => quote.quoteType === 'EQUITY' || quote.quoteType === 'ETF')
      .map((quote) => ({
        ticker: quote.symbol,
        companyName: quote.longname || quote.shortname || quote.symbol,
        exchange: quote.exchange,
        sector: quote.sector || quote.industry || 'Financial Asset',
        quoteType: quote.quoteType
      }));

    return matches;
  } catch (error) {
    console.error(`CompanyService Error: ${error.message}`);
    throw new Error(`Search service error: ${error.message}`);
  }
};
