import React, { useState } from 'react';
import { Search, Compass, AlertCircle, BarChart3, Globe, Cpu, ArrowRight } from 'lucide-react';

/**
 * Home Component (Search & Trigger Terminal) in Warm Cream-Beige Theme
 * Modern Two-Column Layout
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 text-center">
      
      {/* Centered Hero Header */}
      <div className="mb-12">
        <div className="inline-flex items-center space-x-2.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-xs font-black uppercase tracking-wider text-amber-700">
            Institutional Intelligence Platform
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-6">
          AI Investment <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Research Assistant</span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-slate-600 text-lg md:text-xl leading-relaxed mb-10">
          Compile institutional-grade analysis reports leveraging Google Gemini, real-time news pipelines, and comprehensive financial tools.
        </p>
      </div>

      {/* Feature Chips */}
      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto mb-16">
        <div className="flex items-center space-x-3.5 bg-white/80 border border-slate-200/80 rounded-2xl px-5 py-3 shadow-sm hover:shadow-md hover:border-orange-200 transition-all select-none">
          <div className="bg-orange-500/15 text-orange-600 p-2.5 rounded-xl">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Market Data</h4>
            <p className="text-xs text-slate-500 font-medium">Live ratios & financial profiles</p>
          </div>
        </div>
        <div className="flex items-center space-x-3.5 bg-white/80 border border-slate-200/80 rounded-2xl px-5 py-3 shadow-sm hover:shadow-md hover:border-orange-200 transition-all select-none">
          <div className="bg-orange-500/15 text-orange-600 p-2.5 rounded-xl">
            <Globe className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Live News</h4>
            <p className="text-xs text-slate-500 font-medium font-medium">Aggregated sentiment analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-3.5 bg-white/80 border border-slate-200/80 rounded-2xl px-5 py-3 shadow-sm hover:shadow-md hover:border-orange-200 transition-all select-none">
          <div className="bg-orange-500/15 text-orange-600 p-2.5 rounded-xl">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Gemini Pipeline</h4>
            <p className="text-xs text-slate-500 font-medium">Detailed reports in seconds</p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Area */}
      <div className="max-w-7xl mx-auto mb-20 text-left grid grid-cols-1 xl:grid-cols-[1.35fr_0.95fr] gap-8 xl:gap-10 items-start">
        <div className="relative group rounded-3xl p-[1px] bg-gradient-to-br from-slate-200 via-orange-100 to-slate-200 hover:from-orange-400 hover:via-amber-400 hover:to-orange-500 transition-all duration-500 shadow-xl hover:shadow-orange-500/10">
          {/* Glow Effects */}
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/10 transition-colors duration-500" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-500" />

          <div className="bg-white/95 backdrop-blur-xl rounded-[23px] p-8 md:p-12 relative overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Ticker Input */}
              <div className="relative">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-extrabold uppercase tracking-wider text-slate-700">
                    Company Ticker Symbol
                  </label>
                  <span className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-lg font-extrabold border border-orange-100">
                    e.g., TSLA, NVDA, AAPL
                  </span>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-5 text-slate-400 font-mono text-xl font-bold select-none">$</div>
                  <input
                    type="text"
                    placeholder="AAPL"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-6 py-5 text-slate-900 placeholder-slate-350 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-mono uppercase text-xl tracking-widest font-black"
                  />
                </div>
              </div>

              {/* Research Query Input */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-extrabold uppercase tracking-wider text-slate-700">
                    Research Objective / Focus Query
                  </label>
                </div>
                <textarea
                  rows={5}
                  placeholder="Detail what specific aspects of the financial or operational state you would like the AI Agent to investigate..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-6 py-5 text-slate-900 placeholder-slate-450 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all resize-none text-lg leading-relaxed font-semibold"
                />
              </div>

              {/* Validation Alert */}
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-5 rounded-2xl flex items-center space-x-3.5 text-base font-bold animate-pulse">
                  <AlertCircle className="w-6 h-6 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-extrabold py-5 px-8 rounded-2xl flex items-center justify-center space-x-3.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-orange-500/25 active:shadow-none cursor-pointer text-lg tracking-wider uppercase"
              >
                <Search className="w-6 h-6 animate-pulse" />
                <span>Generate Research Report</span>
              </button>

            </form>
          </div>
        </div>

        {/* Suggested Templates Column */}
        <div className="text-left xl:-mt-3">
          <div className="flex items-center space-x-2 text-slate-600 mb-6">
            <Compass className="w-5 h-5 text-orange-500 animate-spin-slow" />
            <span className="text-sm font-extrabold uppercase tracking-widest text-slate-500">
              Suggested Templates
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {shortcuts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleShortcutClick(item.ticker, item.query)}
                className="w-full text-left bg-white hover:bg-slate-50/80 border border-slate-200 rounded-2xl p-6 transition-all duration-200 group flex flex-col justify-between shadow-sm cursor-pointer hover:border-orange-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="bg-orange-50 text-orange-600 font-mono font-bold text-xs px-2.5 py-1 rounded-lg border border-orange-100 uppercase tracking-wider">
                      {item.ticker}
                    </span>
                    <h4 className="text-base font-black text-slate-800 group-hover:text-orange-500 transition-colors">
                      {item.label}
                    </h4>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {item.query}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Use template</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
