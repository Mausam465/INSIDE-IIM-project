import React, { useState } from 'react';
import { Search, Compass, AlertCircle } from 'lucide-react';

/**
 * Home Component (Search & Trigger Terminal) in Light Theme
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
        <h2 className="text-4xl font-extrabold text-[#0f172a] mb-3">AI Investment Research Assistant</h2>
        <p className="text-slate-500 text-base max-w-xl mx-auto">
          Compile institutional-grade analysis reports leveraging Google Gemini, news pipelines, and real-time financial tools.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Ticker Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Company Ticker Symbol
            </label>
            <input
              type="text"
              placeholder="e.g. AAPL, NVDA, TSLA"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono uppercase text-sm"
            />
          </div>

          {/* Research Query Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Research Objective / Focus Query
            </label>
            <textarea
              rows={4}
              placeholder="Detail what specific aspects of the financial or operational state you would like the AI Agent to investigate..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none text-sm"
            />
          </div>

          {/* Validation Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center space-x-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg shadow-blue-500/10 cursor-pointer text-sm"
          >
            <Search className="w-5 h-5" />
            <span>Generate Research Report</span>
          </button>

        </form>
      </div>

      {/* Suggested Shortcuts */}
      <div>
        <div className="flex items-center space-x-2 text-slate-500 mb-4">
          <Compass className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-bold uppercase tracking-wider">Suggested Templates</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shortcuts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleShortcutClick(item.ticker, item.query)}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-left p-4 rounded-xl transition-all group flex flex-col justify-between shadow-sm hover:shadow-md cursor-pointer"
            >
              <div>
                <span className="inline-block bg-blue-50 text-blue-600 font-mono font-bold text-[10px] px-2 py-0.5 rounded mb-2 border border-blue-100">
                  {item.ticker}
                </span>
                <h4 className="text-slate-800 font-bold group-hover:text-blue-600 transition-colors mb-1 text-sm">
                  {item.label}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
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
