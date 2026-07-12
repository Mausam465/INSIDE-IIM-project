import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

// Lazily load model. Boots cleanly even if environment variables are not yet defined.
let model = null;

const getGeminiModel = () => {
  if (!model) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      model = new ChatGoogleGenerativeAI({
        apiKey: apiKey,
        modelName: 'gemini-1.5-flash',
        temperature: 0.2
      });
    }
  }
  return model;
};

/**
 * Executes a LangChain RunnableSequence to synthesize stock research.
 * Falls back to local template generator if API key is missing or fails.
 * 
 * @param {string} ticker - Stock symbol
 * @param {Object} profile - Company profile summary
 * @param {Object} metrics - Financial statistics
 * @param {Array} news - Recent stock news articles
 * @param {string} query - Specific focus questions
 * @returns {Promise<string>} - The synthesized Markdown report output
 */
export const runInvestmentSequence = async (ticker, profile, metrics, news, query) => {
  const symbol = ticker.toUpperCase().trim();
  const llm = getGeminiModel();

  if (!llm) {
    console.warn(`GEMINI_API_KEY is not configured. Falling back to local template sequence for ${symbol}.`);
    return compileLocalSequenceReport(symbol, profile, metrics, news, query);
  }

  // Create PromptTemplate representing structural layout
  const promptTemplate = PromptTemplate.fromTemplate(`
You are an institutional financial analyst. Write a professional investment research report on {ticker}.
Address the following research objective: "{query}"

Company Profile context:
{profile}

Key Financial Metrics:
{metrics}

Aggregated News context:
{news}

Write a detailed analysis. Format your output strictly in Markdown with these headers:
# Research Report: {ticker}
## Executive Summary
## Financial Ratios and Metrics Analysis
## News Sentiment Synthesis
## Core Risks & Headwinds
## Final Verdict
`);

  try {
    // Chain sequence via LCEL (LangChain Expression Language)
    const sequence = RunnableSequence.from([
      promptTemplate,
      llm,
      new StringOutputParser()
    ]);

    const output = await sequence.invoke({
      ticker: symbol,
      query: query,
      profile: JSON.stringify(profile, null, 2),
      metrics: JSON.stringify(metrics, null, 2),
      news: JSON.stringify(news, null, 2)
    });

    return output;

  } catch (error) {
    console.error(`LangChainSequence Error for ${symbol}: ${error.message}. Triggering fallback sequence.`);
    return compileLocalSequenceReport(symbol, profile, metrics, news, query);
  }
};

/**
 * Fallback sequence output compiler if the LLM fails.
 */
const compileLocalSequenceReport = (ticker, profile, metrics, news, query) => {
  return `# Research Report: ${ticker}
Generated in offline fallback sequence mode.

## Executive Summary
This report analyzes **${ticker}** to resolve: *"${query}"*.

## Financial Ratios and Metrics Analysis
* **Market Capitalization**: $${metrics.marketCap ? (metrics.marketCap / 1e9).toFixed(1) + 'B' : 'N/A'}
* **P/E Valuation Ratio**: ${metrics.peRatio || 'N/A'}
* **EPS Growth**: ${metrics.eps || 'N/A'}
* **Operational Revenue**: $${metrics.revenue ? (metrics.revenue / 1e9).toFixed(1) + 'B' : 'N/A'}

## News Sentiment Synthesis
- Analyzed ${news.length} news articles. Headlines suggest active market movements and corporate interest.

## Core Risks & Headwinds
- High interest rate environments present financing headwinds.
- Changing market dynamics could impact operational profit margins.

## Final Verdict
The asset indicates steady fundamentals. Recommended: **NEUTRAL / HOLD** pending further live news confirmation.
`;
};
