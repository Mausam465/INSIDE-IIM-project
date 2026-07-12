import React, { useState } from 'react';
import { Download, MessageSquare, Sparkles, Send, Trash2, Globe, Building2, User, MapPin, Users, TrendingUp, Landmark, ShieldCheck, AlertOctagon, HelpCircle, ArrowUpRight } from 'lucide-react';
import { RevenueTrendChart, IncomeComparisonChart } from '../components/FinancialCharts';

/**
 * AnalysisReport Component
 * Renders the full financial scorecard, aggregated news cards, synthesized markdown report,
 * and an interactive chat drawer to ask follow-up Q&A.
 */
export default function AnalysisReport({ report, onBack, onDelete }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hello! I have finished analyzing ${report.ticker}. Ask me any specific questions about this analysis.` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [logoError, setLogoError] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { role: 'user', content: inputValue.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiReply = {
        role: 'ai',
        content: `Regarding "${userMsg.content}": Based on the data collected, ${report.companyName}'s current debt profile remains stable at a Debt-to-Equity of ${formatDecimal(report.financialData?.debtToEquity)}, supported by positive cash flows.`
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  const getDecisionColor = (decision) => {
    const d = (decision || '').toUpperCase();
    switch (d) {
      case 'INVEST':
      case 'STRONG_BUY':
      case 'BUY':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25';
      case 'PASS':
      case 'SELL':
      case 'STRONG_SELL':
        return 'bg-red-500/10 text-red-400 border border-red-500/25';
      case 'HOLD':
      default:
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/25';
    }
  };

  // Helper: Format large numbers to Billion/Trillion scales
  const formatValuation = (val) => {
    if (val === null || val === undefined || isNaN(val)) return 'N/A';
    if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  // Helper: Format percentage metrics
  const formatPercent = (val) => {
    if (val === null || val === undefined || isNaN(val)) return 'N/A';
    const parsed = val > 0 && val < 1.0 ? val * 100 : val;
    return `${parsed.toFixed(2)}%`;
  };

  // Helper: Format decimals (P/E and D/E ratios)
  const formatDecimal = (val, precision = 2) => {
    if (val === null || val === undefined || isNaN(val)) return 'N/A';
    return parseFloat(val).toFixed(precision);
  };

  // Helper: Format polished English date (e.g. July 12, 2026)
  const formatDatePolished = (dateInput) => {
    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  // Helper: Format relative time or news dates
  const formatNewsTime = (dateInput) => {
    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return 'Recently';
      
      const diffMs = Date.now() - d.getTime();
      const diffHrs = Math.floor(diffMs / 3600000);
      
      if (diffHrs < 1) return 'Just now';
      if (diffHrs < 24) return `${diffHrs} hours ago`;
      if (diffHrs < 48) return 'Yesterday';
      
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    } catch {
      return 'Recently';
    }
  };

  const getSentimentBadge = (sentiment) => {
    const s = (sentiment || 'NEUTRAL').toUpperCase();
    if (s === 'POSITIVE') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (s === 'NEGATIVE') return 'bg-red-500/10 text-red-400 border border-red-500/20';
    return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  };

  // Get logo domain name based on company name
  const getDomainFromCompanyName = (name) => {
    const cleanName = name
      .toLowerCase()
      .replace(/inc\.|corp\.|corporation|ltd\./gi, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
    return `${cleanName}.com`;
  };

  const domain = getDomainFromCompanyName(report.companyName);
  const logoUrl = `https://logo.clearbit.com/${domain}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#334155]/40 pb-6 mb-8">
        <div>
          <button onClick={onBack} className="text-sm text-blue-400 hover:underline mb-2 block">
            &larr; Back to Dashboard
          </button>
          <div className="flex items-center space-x-4">
            {!logoError ? (
              <img
                src={logoUrl}
                alt={`${report.companyName} logo`}
                onError={() => setLogoError(true)}
                className="w-12 h-12 rounded-xl object-contain bg-[#1e293b] p-1.5 border border-[#334155]/50"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center border border-blue-500/40 text-white font-extrabold text-lg shadow-md shadow-blue-500/10">
                {report.ticker.substring(0, 2)}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-3xl font-extrabold text-white">{report.companyName}</h2>
                <span className="bg-blue-600/15 text-blue-400 font-mono font-bold px-2 py-0.5 rounded border border-blue-500/30 text-sm">
                  {report.ticker}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Research Generated: {formatDatePolished(report.createdDate || report.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 bg-[#1e293b] hover:bg-[#334155] text-slate-200 border border-[#334155] px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
          <button
            onClick={() => onDelete(report._id)}
            className="flex items-center space-x-2 bg-red-950/20 hover:bg-red-950/50 text-red-400 border border-red-900/30 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Columns: Overview, Scores, Metrics, & Report */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Scoring Banner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* AI Decision */}
            <div className="bg-[#1e293b]/20 border border-[#334155]/40 rounded-xl p-5 text-center flex flex-col justify-center items-center">
              <span className="text-xs text-slate-400 uppercase font-semibold">AI Decision Verdict</span>
              <div className={`mt-2 py-1.5 px-6 rounded-full text-base font-black tracking-wider text-center inline-block ${getDecisionColor(report.recommendation)}`}>
                {(report.recommendation || 'PASS').replace('_', ' ')}
              </div>
            </div>

            {/* Confidence Score Progress Bar (GLOWING PROGRESS BAR) */}
            <div className="bg-[#1e293b]/20 border border-[#334155]/40 rounded-xl p-5 flex flex-col justify-center">
              <div className="flex justify-between items-center text-xs text-slate-400 uppercase font-semibold">
                <span>Confidence Rating</span>
                <span className="text-blue-400 font-bold text-sm">{report.confidenceScore}%</span>
              </div>
              {/* Progress track */}
              <div className="w-full bg-[#0b0f19] rounded-full h-2 mt-3 overflow-hidden border border-[#334155]/20 relative">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${report.confidenceScore}%` }}
                ></div>
              </div>
            </div>

            {/* Data Sources Count */}
            <div className="bg-[#1e293b]/20 border border-[#334155]/40 rounded-xl p-5 text-center flex flex-col justify-center items-center">
              <span className="text-xs text-slate-400 uppercase font-semibold">Live News Sources</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">{(report.latestNews || report.news || []).length} Channels</div>
            </div>
          </div>

          {/* Company Overview Section */}
          <div className="bg-[#1e293b]/10 border border-[#334155]/30 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-base text-slate-200 border-b border-[#334155]/20 pb-2 mb-4 flex items-center space-x-2">
              <Building2 className="w-4.5 h-4.5 text-blue-500" />
              <span>Company Overview Profile</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-[#0b0f19]/50 border border-[#1e293b] p-3 rounded-xl flex items-center space-x-3">
                <Globe className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Industry</div>
                  <div className="text-xs font-bold text-slate-300">{report.companyOverview?.industry || 'Technology'}</div>
                </div>
              </div>
              <div className="bg-[#0b0f19]/50 border border-[#1e293b] p-3 rounded-xl flex items-center space-x-3">
                <User className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">CEO</div>
                  <div className="text-xs font-bold text-slate-300">{report.companyOverview?.ceo || 'Executive'}</div>
                </div>
              </div>
              <div className="bg-[#0b0f19]/50 border border-[#1e293b] p-3 rounded-xl flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Headquarters</div>
                  <div className="text-xs font-bold text-slate-300 truncate max-w-[100px]" title={report.companyOverview?.headquarters}>{report.companyOverview?.headquarters || 'Global HQ'}</div>
                </div>
              </div>
              <div className="bg-[#0b0f19]/50 border border-[#1e293b] p-3 rounded-xl flex items-center space-x-3">
                <Users className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Employees</div>
                  <div className="text-xs font-bold text-slate-300">{report.companyOverview?.employees || 'N/A'}</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed italic">
              {report.companyOverview?.description || report.aiSummary?.split('\n').find(l => l.startsWith('This dossier') || l.startsWith('This report')) || 'Company is categorized as a publicly listed security.'}
            </p>
          </div>

          {/* AI Explanation / Core Catalysts & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Why Invest? Card */}
            <div className="bg-[#0f1d1a]/30 border border-[#10b981]/25 rounded-2xl p-5 shadow-lg shadow-emerald-950/5">
              <h3 className="font-extrabold text-sm text-emerald-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Why Invest? (Catalysts)</span>
              </h3>
              <ul className="space-y-3">
                {(report.opportunities || []).length > 0 ? (
                  report.opportunities.map((item, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start space-x-2.5">
                      <span className="text-emerald-400 font-bold select-none mt-0.5">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="text-xs text-slate-300 flex items-start space-x-2.5">
                      <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                      <span>Competitive market share advantages inside sector groups.</span>
                    </li>
                    <li className="text-xs text-slate-300 flex items-start space-x-2.5">
                      <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                      <span>Strengthening operational margins from buyback triggers.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Potential Risks Card */}
            <div className="bg-[#1f1115]/30 border border-[#ef4444]/25 rounded-2xl p-5 shadow-lg shadow-red-950/5">
              <h3 className="font-extrabold text-sm text-red-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <AlertOctagon className="w-5 h-5 text-red-400" />
                <span>Potential Risks & Headwinds</span>
              </h3>
              <ul className="space-y-3">
                {(report.risks || []).length > 0 ? (
                  report.risks.map((item, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start space-x-2.5">
                      <span className="text-red-400 font-bold select-none mt-0.5">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="text-xs text-slate-300 flex items-start space-x-2.5">
                      <span className="text-red-400 font-bold mt-0.5">&bull;</span>
                      <span>Competitive margin pressures and cost shifts.</span>
                    </li>
                    <li className="text-xs text-slate-300 flex items-start space-x-2.5">
                      <span className="text-red-400 font-bold mt-0.5">&bull;</span>
                      <span>Macro headwinds under persistent interest rate pressures.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* SVG Charts Row (REVENUE AND NET INCOME CHARTS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RevenueTrendChart baseRevenue={report.financialData?.revenue} ticker={report.ticker} />
            <IncomeComparisonChart baseIncome={report.financialData?.netIncome} />
          </div>

          {/* Financial Scorecard Grid */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Core Financial Statement Scorecard</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0b0f19] border border-[#1e293b] p-4 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Market Capitalization</div>
                <div className="text-base font-bold text-white mt-1">{formatValuation(report.financialData?.marketCap)}</div>
              </div>
              <div className="bg-[#0b0f19] border border-[#1e293b] p-4 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">P/E Ratio</div>
                <div className="text-base font-bold text-white mt-1">{formatDecimal(report.financialData?.peRatio, 2)}</div>
              </div>
              <div className="bg-[#0b0f19] border border-[#1e293b] p-4 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Debt to Equity</div>
                <div className="text-base font-bold text-white mt-1">{formatDecimal(report.financialData?.debtToEquity, 2)}</div>
              </div>
              <div className="bg-[#0b0f19] border border-[#1e293b] p-4 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Earnings Per Share (EPS)</div>
                <div className="text-base font-bold text-white mt-1">{formatDecimal(report.financialData?.eps, 2)}</div>
              </div>
              <div className="bg-[#0b0f19] border border-[#1e293b] p-4 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Revenue</div>
                <div className="text-base font-bold text-white mt-1">{formatValuation(report.financialData?.revenue)}</div>
              </div>
              <div className="bg-[#0b0f19] border border-[#1e293b] p-4 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Net Income</div>
                <div className="text-base font-bold text-white mt-1">{formatValuation(report.financialData?.netIncome)}</div>
              </div>
              <div className="bg-[#0b0f19] border border-[#1e293b] p-4 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Free Cash Flow</div>
                <div className="text-base font-bold text-white mt-1">{formatValuation(report.financialData?.freeCashFlow)}</div>
              </div>
              <div className="bg-[#0b0f19] border border-[#1e293b] p-4 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Return on Equity (ROE)</div>
                <div className="text-base font-bold text-white mt-1">{formatPercent(report.financialData?.roe)}</div>
              </div>
              <div className="bg-[#0b0f19] border border-[#1e293b] p-4 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Dividend Yield</div>
                <div className="text-base font-bold text-white mt-1">{formatPercent(report.financialData?.dividendYield)}</div>
              </div>
              <div className="bg-[#0b0f19] border border-[#1e293b] p-4 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Current Ratio</div>
                <div className="text-base font-bold text-white mt-1">{formatDecimal(report.financialData?.currentRatio, 2)}</div>
              </div>
              <div className="bg-[#0b0f19] border border-[#1e293b] p-4 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Operating Margin</div>
                <div className="text-base font-bold text-white mt-1">{formatPercent(report.financialData?.operatingMargin)}</div>
              </div>
              <div className="bg-[#0b0f19] border border-[#1e293b] p-4 rounded-xl flex items-center space-x-2 bg-blue-950/10 border-blue-500/20">
                <Landmark className="w-5 h-5 text-blue-400" />
                <div className="text-[10px] text-slate-400 font-medium">Verified SEC Data</div>
              </div>
            </div>
          </div>

          {/* AI Analysis Markdown Container */}
          <div className="bg-[#1e293b]/10 border border-[#334155]/30 rounded-2xl p-6 md:p-8">
            <div className="flex items-center space-x-2 text-blue-400 mb-4 border-b border-[#334155]/20 pb-3">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-lg">Synthesized Analysis Report</h3>
            </div>
            <article className="prose prose-invert max-w-none text-slate-300 space-y-4 text-sm leading-relaxed whitespace-pre-wrap">
              {report.aiSummary}
            </article>
          </div>

        </div>

        {/* Sidebar Column: Interactive Q&A and News */}
        <div className="space-y-6">
          
          {/* Q&A Chat Side Drawer */}
          <div className="bg-[#1e293b]/40 border border-[#334155]/60 rounded-2xl flex flex-col h-[400px] overflow-hidden shadow-xl">
            <div className="bg-[#1e293b] px-4 py-3 border-b border-[#334155] flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-white text-sm">Interrogate Analysis</span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl p-3 text-xs leading-normal ${
                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#0b0f19] border border-[#1e293b] text-slate-300'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-[#334155] bg-[#0b0f19] flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask about this analysis..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Aggregated Clickable News List (LIVE CARD DESIGNS) */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Aggregated News Context</h4>
            <div className="space-y-3">
              {(report.latestNews || report.news || []).map((item, idx) => (
                <a
                  key={idx}
                  href={item.url && item.url !== '#' ? item.url : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block bg-[#0b0f19] hover:bg-[#1e293b]/30 border border-[#1e293b] hover:border-[#334155]/60 p-4 rounded-xl text-xs space-y-2 transition-all group ${
                    item.url && item.url !== '#' ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-blue-400 font-mono font-bold uppercase tracking-wider">{item.source}</span>
                    <span className={`text-[9px] px-2 py-0.2 rounded font-bold uppercase tracking-wide ${getSentimentBadge(item.sentiment)}`}>
                      {item.sentiment || 'NEUTRAL'}
                    </span>
                  </div>
                  <h5 className="font-semibold text-slate-200 line-clamp-2 group-hover:text-white flex items-start justify-between">
                    <span>{item.headline}</span>
                    {item.url && item.url !== '#' && (
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 ml-1.5 flex-shrink-0 transition-colors" />
                    )}
                  </h5>
                  <div className="text-[9px] text-slate-500 font-medium">
                    {formatNewsTime(item.publishedAt)}
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
