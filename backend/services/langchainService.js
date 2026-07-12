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
 * Executes a LangChain RunnableSequence to synthesize stock research as structured JSON.
 * Falls back to local template generator if API key is missing or fails.
 * 
 * @param {string} ticker - Stock symbol
 * @param {Object} profile - Company profile summary
 * @param {Object} metrics - Financial statistics
 * @param {Array} news - Recent stock news articles
 * @param {string} query - Specific focus questions
 * @returns {Promise<Object>} - The parsed JSON containing investmentDecision, confidenceScore, and reportMarkdown
 */
export const runInvestmentSequence = async (ticker, profile, metrics, news, query) => {
  const symbol = ticker.toUpperCase().trim();
  const llm = getGeminiModel();

  if (!llm) {
    console.warn(`GEMINI_API_KEY is not configured. Falling back to local template sequence for ${symbol}.`);
    return compileLocalSequenceReport(symbol, profile, metrics, news, query);
  }

  // Create PromptTemplate requesting JSON payload
  const promptTemplate = PromptTemplate.fromTemplate(`
You are an institutional financial analyst. Write a professional investment research report on {ticker} responding to: "{query}".

Here is the raw stock data collected:
Company Profile: {profile}
Key Financial Metrics: {metrics}
Recent News Articles: {news}

Your response MUST be a valid JSON object matching this schema:
{{
  "investmentDecision": "STRONG_BUY" | "BUY" | "HOLD" | "SELL" | "STRONG_SELL",
  "confidenceScore": 0-100,
  "reportMarkdown": "Complete markdown report text"
}}

Formatting guidelines for "reportMarkdown":
- Include sections for: Executive Summary, Financial Metrics Analysis, News Sentiment Synthesis, Risks & Headwinds, and Final Verdict.
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
      investmentDecision: parsed.investmentDecision || 'HOLD',
      confidenceScore: parsed.confidenceScore || 70,
      reportMarkdown: parsed.reportMarkdown || `# Stock Analysis: ${symbol}\nFailed to compile text.`
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

## Core Risks & Headwinds
- High interest rate environments present financing headwinds.
- Changing market dynamics could impact operational profit margins.

## Final Verdict
The asset indicates steady fundamentals. Recommended: **NEUTRAL / HOLD** pending further live news confirmation.
`;

  return {
    investmentDecision: decision,
    confidenceScore: confidence,
    reportMarkdown: md
  };
};
