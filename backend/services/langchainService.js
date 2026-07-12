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
        temperature: 0.2,
        modelKwargs: {
          responseMimeType: 'application/json'
        }
      });
    }
  }
  return model;
};

/**
 * Executes a LangChain RunnableSequence to synthesize stock research.
 * Outputs a structured JSON payload conforming to database model expectations.
 * 
 * @param {string} ticker - Stock symbol
 * @param {Object} profile - Company profile summary
 * @param {Object} metrics - Financial statistics
 * @param {Array} news - Recent stock news articles
 * @param {string} query - Specific focus questions
 * @returns {Promise<Object>} - The parsed JSON containing recommendation, confidenceScore, aiSummary, risks, and opportunities
 */
export const runInvestmentSequence = async (ticker, profile, metrics, news, query) => {
  const symbol = ticker.toUpperCase().trim();
  const llm = getGeminiModel();

  if (!llm) {
    console.warn(`GEMINI_API_KEY is not configured. Falling back to local template sequence for ${symbol}.`);
    return compileLocalSequenceReport(symbol, profile, metrics, news, query);
  }

  // Create PromptTemplate requesting JSON payload with required Mongoose schema keys
  const promptTemplate = PromptTemplate.fromTemplate(`
You are an institutional financial analyst. Write a professional investment research report on {ticker} responding to: "{query}".

Here is the raw stock data collected:
Company Profile: {profile}
Key Financial Metrics: {metrics}
Recent News Articles: {news}

Your response MUST be a valid JSON object matching this schema:
{{
  "recommendation": "INVEST" | "PASS" | "STRONG_BUY" | "BUY" | "HOLD" | "SELL" | "STRONG_SELL",
  "confidenceScore": 0-100,
  "aiSummary": "Complete detailed markdown summary report text.",
  "risks": ["Risk point 1", "Risk point 2", "Risk point 3"],
  "opportunities": ["Opportunity point 1", "Opportunity point 2", "Opportunity point 3"]
}}

Formatting guidelines for "aiSummary":
- Include sections for: Executive Summary, Financial Metrics Analysis, News Sentiment Synthesis, and Final Verdict.
- Make the tone objective, analytical, and professional.
`);

  try {
    const sequence = RunnableSequence.from([
      promptTemplate,
      llm,
      new StringOutputParser()
    ]);

    const outputText = await sequence.invoke({
      ticker: symbol,
      query: query,
      profile: JSON.stringify(profile, null, 2),
      metrics: JSON.stringify(metrics, null, 2),
      news: JSON.stringify(news, null, 2)
    });

    const parsed = JSON.parse(outputText);

    return {
      recommendation: parsed.recommendation || 'HOLD',
      confidenceScore: parsed.confidenceScore || 70,
      aiSummary: parsed.aiSummary || `# Stock Analysis: ${symbol}\nFailed to compile text.`,
      risks: Array.isArray(parsed.risks) ? parsed.risks : ['Market price fluctuations.'],
      opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : ['Expanding business sectors.']
    };

  } catch (error) {
    console.error(`LangChainSequence Error for ${symbol}: ${error.message}. Triggering fallback sequence.`);
    return compileLocalSequenceReport(symbol, profile, metrics, news, query);
  }
};

/**
 * Fallback sequence output compiler if the LLM fails.
 */
const compileLocalSequenceReport = (ticker, profile, metrics, news, query) => {
  const pe = metrics.peRatio || 'N/A';
  const cap = metrics.marketCap ? `$${(metrics.marketCap / 1e9).toFixed(1)}B` : 'N/A';
  const decision = metrics.peRatio && metrics.peRatio < 25 ? 'BUY' : 'HOLD';
  const confidence = 85;

  const md = `# Research Report: ${ticker}
Generated in offline fallback sequence mode.

## Executive Summary
This report analyzes **${ticker}** to resolve: *"${query}"*.

## Financial Ratios and Metrics Analysis
* **Market Capitalization**: ${cap}
* **P/E Valuation Ratio**: ${pe}
* **EPS Growth**: ${metrics.eps || 'N/A'}
* **Operational Revenue**: $${metrics.revenue ? (metrics.revenue / 1e9).toFixed(1) + 'B' : 'N/A'}

## News Sentiment Synthesis
- Analyzed ${news.length} news articles. Headlines suggest active market movements and corporate interest.
`;

  return {
    recommendation: decision,
    confidenceScore: confidence,
    aiSummary: md,
    risks: [
      'High interest rate environments present financing headwinds.',
      'Changing market dynamics could impact operational profit margins.'
    ],
    opportunities: [
      'Digital cloud integration trends provide TAM expansion.',
      'Potential efficiency improvements based on cash flow allocations.'
    ]
  };
};
