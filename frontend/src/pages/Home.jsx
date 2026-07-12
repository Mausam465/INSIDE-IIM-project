import React, { useState } from 'react';
import { Search, Compass, AlertCircle } from 'lucide-react';

/**
 * Home Component (Search & Trigger Terminal) in Metallic Steel-Blue Theme
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
      <div className="text-center mb-12">
        <div className="text-[10px] text-slate-500 font-mono font-bold tracking-[0.25em] mb-4 uppercase">
          PROCESS_SYS // AGENT_PIPELINE
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-4 uppercase font-mono tracking-wider leading-tight">
          AI Investment Research Console
        </h2>
        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
          Compile institutional-grade analysis reports leveraging Google Gemini, news pipelines, and real-time financial tools.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-xl p-8 shadow-lg mb-10 relative">
        {/* Monospace Tech crosshairs */}
        <span className="absolute top-2 left-2 text-slate-400/30 text-xs font-mono font-bold select-none">+</span>
        <span className="absolute top-2 right-2 text-slate-400/30 text-xs font-mono font-bold select-none">+</span>
        <span className="absolute bottom-2 left-2 text-slate-400/30 text-xs font-mono font-bold select-none">+</span>
        <span className="absolute bottom-2 right-2 text-slate-400/30 text-xs font-mono font-bold select-none">+</span>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Ticker Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono">
                Asset Ticker Symbol // SEC_IDX
              </label>
              <span className="text-[9px] text-slate-400 font-mono">SYS_REG: COMP_VAL</span>
            </div>
            <input
              type="text"
              placeholder="E.G. AAPL, NVDA, TSLA"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-mono uppercase text-xs tracking-wider"
            />
          </div>

          {/* Research Query Input */}
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono mb-2">
              Focus Objective // QUERY_STRING
            </label>
            <textarea
              rows={4}
              placeholder="Detail what specific aspects of the financial or operational state you would like the AI Agent to investigate..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Validation Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center space-x-3 text-xs font-mono">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-550 text-white font-bold py-3 px-6 rounded transition-all shadow-md hover:shadow-lg shadow-blue-500/15 cursor-pointer text-xs font-mono tracking-wider"
          >
            <Search className="w-4 h-4 inline-block mr-2" />
            <span>RUN_AGENT_PROCESS</span>
          </button>

        </form>
      </div>

      {/* Suggested Shortcuts */}
      <div>
        <div className="flex items-center space-x-2 text-slate-500 mb-4 font-mono">
          <Compass className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Suggested Templates // Presets</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shortcuts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleShortcutClick(item.ticker, item.query)}
              className="bg-white/60 hover:bg-white/90 border border-slate-200 rounded p-4 transition-all group relative cursor-pointer shadow-sm hover:shadow-md"
            >
              {/* Corner crosshairs for templates */}
              <span className="absolute top-1.5 left-1.5 text-slate-400/20 text-[8px] font-mono select-none">+</span>
              <span className="absolute top-1.5 right-1.5 text-slate-400/20 text-[8px] font-mono select-none">+</span>

              <div>
                <span className="inline-block bg-blue-50 text-blue-600 font-mono font-bold text-[9px] px-2 py-0.5 rounded mb-2 border border-blue-100">
                  {item.ticker}
                </span>
                <h4 className="text-slate-800 font-bold group-hover:text-blue-600 transition-colors mb-1 text-xs font-mono">
                  {item.label}
                </h4>
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
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
