import React, { useState } from 'react';
import { Search, Compass, AlertCircle } from 'lucide-react';

/**
 * Home Component (Search & Trigger Terminal)
 * Renders the primary landing view for analysts to kick off a research generation pipeline.
 * 
 * React Concept: useState Hook
 * - Used to track the reactive inputs of the form locally (ticker, query, validation errors)
 *   before submitting the final values up to the parent application.
 */
export default function Home({ onSearch }) {
  const [ticker, setTicker] = useState('');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!ticker.trim()) {
      setError('Ticker symbol is required (e.g., TSLA).');
      return;
    }
    if (!query.trim()) {
      setError('Research objective or focus query is required.');
      return;
    }

    // Pass data up to App.jsx handler
    onSearch({ ticker: ticker.toUpperCase().trim(), query: query.trim() });
  };

  const handleShortcutClick = (shortcutTicker, shortcutQuery) => {
    setTicker(shortcutTicker);
    setQuery(shortcutQuery);
    setError('');
  };

  const shortcuts = [
    { ticker: 'AAPL', label: 'Analyze Apple Profitability', query: 'Analyze profit margins and free cash flow trend over the last 3 quarters' },
    { ticker: 'TSLA', label: 'Tesla Growth Prospects', query: 'Evaluate vehicle delivery rates growth vs valuation metrics' },
    { ticker: 'NVDA', label: 'Nvidia AI Expansion', query: 'Analyze AI demand impact on gross margins and current debt levels' },
    { ticker: 'MSFT', label: 'Microsoft Cloud Margin', query: 'Evaluate Azure cloud revenue segments and operational risks' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Intro Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-white mb-3">AI Investment Research Assistant</h2>
        <p className="text-slate-400 text-lg">
          Compile institutional-grade analysis reports leveraging Google Gemini, news pipelines, and real-time financial tools.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-[#334155]/60 rounded-2xl p-8 shadow-2xl mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Ticker Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wide">
              Company Ticker Symbol
            </label>
            <input
              type="text"
              placeholder="e.g. AAPL, NVDA, TSLA"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="w-full bg-[#0b0f19] border border-[#334155] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono uppercase"
            />
          </div>

          {/* Research Query Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wide">
              Research Objective / Focus Query
            </label>
            <textarea
              rows={4}
              placeholder="Detail what specific aspects of the financial or operational state you would like the AI Agent to investigate..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#0b0f19] border border-[#334155] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          {/* Validation Alert */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center space-x-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-500/20"
          >
            <Search className="w-5 h-5" />
            <span>Generate Research Report</span>
          </button>

        </form>
      </div>

      {/* Suggested Shortcuts */}
      <div>
        <div className="flex items-center space-x-2 text-slate-300 mb-4">
          <Compass className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold uppercase tracking-wider">Suggested Templates</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shortcuts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleShortcutClick(item.ticker, item.query)}
              className="bg-[#1e293b]/20 hover:bg-[#1e293b]/50 border border-[#334155]/40 text-left p-4 rounded-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="inline-block bg-blue-600/10 text-blue-400 font-mono font-bold text-xs px-2 py-0.5 rounded mb-2 border border-blue-500/25">
                  {item.ticker}
                </span>
                <h4 className="text-slate-200 font-semibold group-hover:text-white transition-colors mb-1 text-sm">
                  {item.label}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {item.query}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
