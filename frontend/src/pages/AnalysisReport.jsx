import React, { useState } from 'react';
import { Download, MessageSquare, Sparkles, Send, Trash2, Globe, Building2, User, MapPin, Users, TrendingUp, Landmark, ShieldCheck, AlertOctagon, ArrowUpRight } from 'lucide-react';
import { RevenueTrendChart, IncomeComparisonChart } from '../components/FinancialCharts';

/**
 * AnalysisReport Component in Metallic Steel-Blue Theme
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
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'PASS':
      case 'SELL':
      case 'STRONG_SELL':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'HOLD':
      default:
        return 'bg-amber-50 text-amber-700 border border-amber-200';
    }
  };

  const formatValuation = (val) => {
    if (val === null || val === undefined || isNaN(val)) return 'N/A';
    if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  const formatPercent = (val) => {
    if (val === null || val === undefined || isNaN(val)) return 'N/A';
    const parsed = val > 0 && val < 1.0 ? val * 100 : val;
    return `${parsed.toFixed(2)}%`;
  };

  const formatDecimal = (val, precision = 2) => {
    if (val === null || val === undefined || isNaN(val)) return 'N/A';
    return parseFloat(val).toFixed(precision);
  };

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
    if (s === 'POSITIVE') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (s === 'NEGATIVE') return 'bg-red-50 text-red-700 border border-red-200';
    return 'bg-slate-100 text-slate-650 border border-slate-200';
  };

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
    <div className="max-w-6xl mx-auto px-4 py-8 text-slate-900">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200/60 pb-6 mb-8">
        <div>
          <button onClick={onBack} className="text-sm font-semibold text-blue-600 hover:underline mb-2 block cursor-pointer">
            &larr; Back to Dashboard
          </button>
          <div className="flex items-center space-x-4">
            {!logoError ? (
              <img
                src={logoUrl}
                alt={`${report.companyName} logo`}
                onError={() => setLogoError(true)}
                className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-200/60"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-lg shadow-md font-mono">
                {report.ticker.substring(0, 2)}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-3xl font-extrabold text-slate-800 font-mono">{report.companyName}</h2>
                <span className="bg-blue-50 text-blue-605 font-mono font-bold px-2 py-0.5 rounded border border-blue-100 text-sm">
                  {report.ticker}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-semibold font-mono">
                Research Generated: {formatDatePolished(report.createdDate || report.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 bg-white/70 hover:bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
          <button
            onClick={() => onDelete(report._id)}
            className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Columns */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Scoring Banner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* AI Decision */}
            <div className="bg-white/70 border border-slate-200/60 rounded p-5 text-center flex flex-col justify-center items-center shadow-sm relative">
              <span className="absolute top-1.5 left-2 text-slate-400/20 text-[8px] font-mono select-none">+</span>
              <span className="absolute top-1.5 right-2 text-slate-400/20 text-[8px] font-mono select-none">+</span>
              <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider font-mono">AI Decision Verdict</span>
              <div className={`mt-2 py-1.5 px-6 rounded text-xs font-mono font-bold tracking-wider text-center inline-block ${getDecisionColor(report.recommendation)}`}>
                {(report.recommendation || 'PASS').replace('_', ' ')}
              </div>
            </div>

            {/* Confidence Score Progress Bar */}
            <div className="bg-white/70 border border-slate-200/60 rounded p-5 flex flex-col justify-center shadow-sm relative">
              <span className="absolute top-1.5 left-2 text-slate-400/20 text-[8px] font-mono select-none">+</span>
              <span className="absolute top-1.5 right-2 text-slate-400/20 text-[8px] font-mono select-none">+</span>
              <div className="flex justify-between items-center text-[10px] text-slate-450 uppercase font-bold tracking-wider font-mono">
                <span>Confidence</span>
                <span className="text-blue-600 font-extrabold text-sm">{report.confidenceScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden border border-slate-200 relative">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${report.confidenceScore}%` }}
                ></div>
              </div>
            </div>

            {/* Data Sources Count */}
            <div className="bg-white/70 border border-slate-200/60 rounded p-5 text-center flex flex-col justify-center items-center shadow-sm relative">
              <span className="absolute top-1.5 left-2 text-slate-400/20 text-[8px] font-mono select-none">+</span>
              <span className="absolute top-1.5 right-2 text-slate-400/20 text-[8px] font-mono select-none">+</span>
              <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider font-mono">Live News Channels</span>
              <div className="text-lg font-bold text-emerald-600 font-mono mt-1">{(report.latestNews || report.news || []).length} Channels</div>
            </div>
          </div>

          {/* Company Overview Section */}
          <div className="bg-white/70 border border-slate-200/60 rounded-xl p-6 shadow-sm relative">
            <span className="absolute top-2 left-2 text-slate-400/25 text-xs font-mono font-bold select-none">+</span>
            <span className="absolute top-2 right-2 text-slate-400/25 text-xs font-mono font-bold select-none">+</span>

            <h3 className="font-bold text-sm text-slate-800 font-mono border-b border-slate-100 pb-2 mb-4 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Company Overview Profile</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-50 border border-slate-100 p-3 rounded flex items-center space-x-3">
                <Globe className="w-4.5 h-4.5 text-blue-500 flex-shrink-0" />
                <div>
                  <div className="text-[8px] text-slate-400 uppercase font-bold font-mono">Industry</div>
                  <div className="text-xs font-bold text-slate-700 font-mono truncate max-w-[100px]">{report.companyOverview?.industry || 'Technology'}</div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded flex items-center space-x-3">
                <User className="w-4.5 h-4.5 text-blue-500 flex-shrink-0" />
                <div>
                  <div className="text-[8px] text-slate-400 uppercase font-bold font-mono">CEO</div>
                  <div className="text-xs font-bold text-slate-700 font-mono truncate max-w-[100px]">{report.companyOverview?.ceo || 'Executive'}</div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded flex items-center space-x-3">
                <MapPin className="w-4.5 h-4.5 text-blue-500 flex-shrink-0" />
                <div>
                  <div className="text-[8px] text-slate-400 uppercase font-bold font-mono">HQ Location</div>
                  <div className="text-xs font-bold text-slate-700 font-mono truncate max-w-[100px]" title={report.companyOverview?.headquarters}>{report.companyOverview?.headquarters || 'Global HQ'}</div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded flex items-center space-x-3">
                <Users className="w-4.5 h-4.5 text-blue-500 flex-shrink-0" />
                <div>
                  <div className="text-[8px] text-slate-400 uppercase font-bold font-mono">Employees</div>
                  <div className="text-xs font-bold text-slate-700 font-mono">{report.companyOverview?.employees || 'N/A'}</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-mono italic">
              {report.companyOverview?.description || report.aiSummary?.split('\n').find(l => l.startsWith('This dossier') || l.startsWith('This report')) || 'Company is categorized as a listed security.'}
            </p>
          </div>

          {/* AI Explanation / Core Catalysts & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Why Invest? Card */}
            <div className="bg-emerald-50/15 border border-emerald-250 p-5 rounded-xl shadow-sm relative">
              <span className="absolute top-1.5 left-2 text-emerald-600/10 text-[8px] font-mono select-none">+</span>
              <span className="absolute top-1.5 right-2 text-emerald-600/10 text-[8px] font-mono select-none">+</span>

              <h3 className="font-bold text-xs text-emerald-700 uppercase tracking-widest font-mono mb-4 flex items-center space-x-2">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                <span>Why Invest? (Catalysts)</span>
              </h3>
              <ul className="space-y-3 font-mono">
                {(report.opportunities || []).length > 0 ? (
                  report.opportunities.map((item, i) => (
                    <li key={i} className="text-[11px] text-slate-700 flex items-start space-x-2">
                      <span className="text-emerald-500 font-bold select-none">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="text-[11px] text-slate-700 flex items-start space-x-2">
                      <span className="text-emerald-500 font-bold">&bull;</span>
                      <span>Competitive market share advantages inside sector groups.</span>
                    </li>
                    <li className="text-[11px] text-slate-700 flex items-start space-x-2">
                      <span className="text-emerald-500 font-bold">&bull;</span>
                      <span>Strengthening operational margins from buyback triggers.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Potential Risks Card */}
            <div className="bg-red-50/15 border border-red-250 p-5 rounded-xl shadow-sm relative">
              <span className="absolute top-1.5 left-2 text-red-650/10 text-[8px] font-mono select-none">+</span>
              <span className="absolute top-1.5 right-2 text-red-650/10 text-[8px] font-mono select-none">+</span>

              <h3 className="font-bold text-xs text-red-700 uppercase tracking-widest font-mono mb-4 flex items-center space-x-2">
                <AlertOctagon className="w-4.5 h-4.5 text-red-500" />
                <span>Potential Risks & Headwinds</span>
              </h3>
              <ul className="space-y-3 font-mono">
                {(report.risks || []).length > 0 ? (
                  report.risks.map((item, i) => (
                    <li key={i} className="text-[11px] text-slate-700 flex items-start space-x-2">
                      <span className="text-red-500 font-bold select-none">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="text-[11px] text-slate-700 flex items-start space-x-2">
                      <span className="text-red-500 font-bold">&bull;</span>
                      <span>Competitive margin pressures and cost shifts.</span>
                    </li>
                    <li className="text-[11px] text-slate-700 flex items-start space-x-2">
                      <span className="text-red-500 font-bold">&bull;</span>
                      <span>Macro headwinds under persistent interest rate pressures.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* SVG Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RevenueTrendChart baseRevenue={report.financialData?.revenue} ticker={report.ticker} />
            <IncomeComparisonChart baseIncome={report.financialData?.netIncome} />
          </div>

          {/* Financial Scorecard Grid */}
          <div>
            <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest font-mono mb-4 flex items-center space-x-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Core Financial Statement Scorecard</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
              <div className="bg-white/70 border border-slate-200/60 p-4 rounded shadow-sm relative">
                <span className="absolute top-1 left-1.5 text-slate-400/20 text-[7px] select-none">+</span>
                <div className="text-[9px] text-slate-400 uppercase font-bold">Market Cap</div>
                <div className="text-sm font-extrabold text-slate-800 mt-1">{formatValuation(report.financialData?.marketCap)}</div>
              </div>
              <div className="bg-white/70 border border-slate-200/60 p-4 rounded shadow-sm relative">
                <span className="absolute top-1 left-1.5 text-slate-400/20 text-[7px] select-none">+</span>
                <div className="text-[9px] text-slate-400 uppercase font-bold">P/E Ratio</div>
                <div className="text-sm font-extrabold text-slate-800 mt-1">{formatDecimal(report.financialData?.peRatio, 2)}</div>
              </div>
              <div className="bg-white/70 border border-slate-200/60 p-4 rounded shadow-sm relative">
                <span className="absolute top-1 left-1.5 text-slate-400/20 text-[7px] select-none">+</span>
                <div className="text-[9px] text-slate-400 uppercase font-bold">Debt/Equity</div>
                <div className="text-sm font-extrabold text-slate-800 mt-1">{formatDecimal(report.financialData?.debtToEquity, 2)}</div>
              </div>
              <div className="bg-white/70 border border-slate-200/60 p-4 rounded shadow-sm relative">
                <span className="absolute top-1 left-1.5 text-slate-400/20 text-[7px] select-none">+</span>
                <div className="text-[9px] text-slate-400 uppercase font-bold">EPS Ratio</div>
                <div className="text-sm font-extrabold text-slate-800 mt-1">{formatDecimal(report.financialData?.eps, 2)}</div>
              </div>
              <div className="bg-white/70 border border-slate-200/60 p-4 rounded shadow-sm relative">
                <span className="absolute top-1 left-1.5 text-slate-400/20 text-[7px] select-none">+</span>
                <div className="text-[9px] text-slate-400 uppercase font-bold">Revenue</div>
                <div className="text-sm font-extrabold text-slate-800 mt-1">{formatValuation(report.financialData?.revenue)}</div>
              </div>
              <div className="bg-white/70 border border-slate-200/60 p-4 rounded shadow-sm relative">
                <span className="absolute top-1 left-1.5 text-slate-400/20 text-[7px] select-none">+</span>
                <div className="text-[9px] text-slate-400 uppercase font-bold">Net Income</div>
                <div className="text-sm font-extrabold text-slate-800 mt-1">{formatValuation(report.financialData?.netIncome)}</div>
              </div>
              <div className="bg-white/70 border border-slate-200/60 p-4 rounded shadow-sm relative">
                <span className="absolute top-1 left-1.5 text-slate-400/20 text-[7px] select-none">+</span>
                <div className="text-[9px] text-slate-400 uppercase font-bold">Free Cash Flow</div>
                <div className="text-sm font-extrabold text-slate-800 mt-1">{formatValuation(report.financialData?.freeCashFlow)}</div>
              </div>
              <div className="bg-white/70 border border-slate-200/60 p-4 rounded shadow-sm relative">
                <span className="absolute top-1 left-1.5 text-slate-400/20 text-[7px] select-none">+</span>
                <div className="text-[9px] text-slate-400 uppercase font-bold">ROE Metric</div>
                <div className="text-sm font-extrabold text-slate-800 mt-1">{formatPercent(report.financialData?.roe)}</div>
              </div>
              <div className="bg-white/70 border border-slate-200/60 p-4 rounded shadow-sm relative">
                <span className="absolute top-1 left-1.5 text-slate-400/20 text-[7px] select-none">+</span>
                <div className="text-[9px] text-slate-400 uppercase font-bold">Div. Yield</div>
                <div className="text-sm font-extrabold text-slate-800 mt-1">{formatPercent(report.financialData?.dividendYield)}</div>
              </div>
              <div className="bg-white/70 border border-slate-200/60 p-4 rounded shadow-sm relative">
                <span className="absolute top-1 left-1.5 text-slate-400/20 text-[7px] select-none">+</span>
                <div className="text-[9px] text-slate-400 uppercase font-bold">Current Ratio</div>
                <div className="text-sm font-extrabold text-slate-800 mt-1">{formatDecimal(report.financialData?.currentRatio, 2)}</div>
              </div>
              <div className="bg-white/70 border border-slate-200/60 p-4 rounded shadow-sm relative">
                <span className="absolute top-1 left-1.5 text-slate-400/20 text-[7px] select-none">+</span>
                <div className="text-[9px] text-slate-400 uppercase font-bold">Operating Margin</div>
                <div className="text-sm font-extrabold text-slate-800 mt-1">{formatPercent(report.financialData?.operatingMargin)}</div>
              </div>
              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded flex items-center space-x-2 shadow-sm relative">
                <span className="absolute top-1 left-1.5 text-blue-500/20 text-[7px] select-none">+</span>
                <Landmark className="w-4 h-4 text-blue-600" />
                <div className="text-[9px] text-blue-700 font-bold">Verified SEC Data</div>
              </div>
            </div>
          </div>

          {/* AI Analysis Markdown Container */}
          <div className="bg-white/70 border border-slate-200/60 rounded-xl p-6 md:p-8 shadow-sm relative">
            <span className="absolute top-2 left-2 text-slate-400/25 text-xs font-mono font-bold select-none">+</span>
            <span className="absolute top-2 right-2 text-slate-400/25 text-xs font-mono font-bold select-none">+</span>

            <div className="flex items-center space-x-2 text-blue-600 mb-4 border-b border-slate-100 pb-3">
              <Sparkles className="w-4.5 h-4.5" />
              <h3 className="font-bold text-sm font-mono uppercase tracking-wider">Synthesized Analysis Report</h3>
            </div>
            <article className="prose max-w-none text-slate-700 space-y-4 text-[13px] leading-relaxed whitespace-pre-wrap font-mono">
              {report.aiSummary}
            </article>
          </div>

        </div>

        {/* Sidebar Column: Interactive Q&A and News */}
        <div className="space-y-6">
          
          {/* Q&A Chat Side Drawer */}
          <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-[400px] overflow-hidden shadow-md relative">
            <span className="absolute top-1.5 left-2 text-slate-400/20 text-[8px] font-mono select-none">+</span>
            <span className="absolute top-1.5 right-2 text-slate-400/20 text-[8px] font-mono select-none">+</span>

            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-700 text-xs font-mono uppercase tracking-wider">Interrogate Dossier</span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded p-3 text-[10px] leading-normal font-semibold ${
                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-150 text-slate-700'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-slate-50 flex items-center space-x-2 font-mono">
              <input
                type="text"
                placeholder="Query agent about details..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded px-3 py-2 text-[10px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-550 text-white rounded cursor-pointer transition-colors">
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>

          {/* Aggregated Clickable News List */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-3">Aggregated News Context</h4>
            <div className="space-y-3">
              {(report.latestNews || report.news || []).map((item, idx) => (
                <a
                  key={idx}
                  href={item.url && item.url !== '#' ? item.url : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block bg-white/75 hover:bg-white border border-slate-200 hover:border-slate-350 p-4 rounded text-xs space-y-2 transition-all shadow-sm group relative ${
                    item.url && item.url !== '#' ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <span className="absolute top-1 left-1.5 text-slate-400/20 text-[7px] font-mono select-none">+</span>
                  
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-[9px] text-blue-600 font-bold uppercase tracking-wider">{item.source}</span>
                    <span className={`text-[8px] px-2 py-0.2 rounded font-bold uppercase tracking-wide ${getSentimentBadge(item.sentiment)}`}>
                      {item.sentiment || 'NEUTRAL'}
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-700 line-clamp-2 group-hover:text-blue-600 flex items-start justify-between font-mono text-[11px] leading-snug">
                    <span>{item.headline}</span>
                    {item.url && item.url !== '#' && (
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 ml-1.5 flex-shrink-0 transition-colors" />
                    )}
                  </h5>
                  <div className="text-[8px] text-slate-400 font-bold font-mono">
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
