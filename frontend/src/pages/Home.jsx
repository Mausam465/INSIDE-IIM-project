import React, { useState } from 'react';
import { Search, Compass, AlertCircle } from 'lucide-react';

/**
 * Home Component (Search & Trigger Terminal) in Warm Cream-Beige Theme
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
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Intro Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight mb-4">
          AI Investment Research Assistant
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Compile institutional-grade analysis reports leveraging Google Gemini, news pipelines, and real-time financial tools.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-10 shadow-xl shadow-slate-100/50 mb-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Ticker Input */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-extrabold text-slate-700 tracking-wide">
                Company Ticker Symbol
              </label>
              <span className="text-xs text-slate-400 font-medium">e.g., TSLA, NVDA</span>
            </div>
            <input
              type="text"
              placeholder="E.G. AAPL, NVDA, TSLA"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all font-mono uppercase text-base tracking-wider"
            />
          </div>

          {/* Research Query Input */}
          <div>
            <label className="block text-sm font-extrabold text-slate-700 tracking-wide mb-3">
              Research Objective / Focus Query
            </label>
            <textarea
              rows={4}
              placeholder="Detail what specific aspects of the financial or operational state you would like the AI Agent to investigate..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all resize-none text-base leading-relaxed"
            />
          </div>

          {/* Validation Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl flex items-center space-x-3 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center space-x-3 transition-all shadow-lg hover:shadow-xl shadow-orange-500/15 cursor-pointer text-base tracking-wide"
          >
            <Search className="w-5 h-5" />
            <span>Generate Research Report</span>
          </button>

        </form>
      </div>

      {/* Suggested Shortcuts */}
      <div>
        <div className="flex items-center space-x-2.5 text-slate-650 mb-6">
          <Compass className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-extrabold uppercase tracking-widest">Suggested Templates</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shortcuts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleShortcutClick(item.ticker, item.query)}
              className="bg-white hover:bg-slate-50/50 border border-slate-200 rounded-2xl p-6 transition-all group flex flex-col justify-between shadow-sm hover:shadow-md cursor-pointer"
            >
              <div>
                <span className="inline-block bg-orange-50 text-orange-600 font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg mb-3 border border-orange-100">
                  {item.ticker}
                </span>
                <h4 className="text-slate-800 font-extrabold group-hover:text-orange-500 transition-colors mb-1.5 text-base">
                  {item.label}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
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
