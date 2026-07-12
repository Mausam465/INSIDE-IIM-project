import React, { useState } from 'react';
import { Download, MessageSquare, Sparkles, Send, Trash2, Globe, Building2, User, MapPin, Users, TrendingUp, Landmark, ShieldCheck, AlertOctagon, ArrowUpRight } from 'lucide-react';
import { RevenueTrendChart, IncomeComparisonChart } from '../components/FinancialCharts';

/**
 * AnalysisReport Component in Warm Cream-Beige Theme with Large, Professional Typography
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
    return 'bg-slate-100 text-slate-600 border border-slate-200';
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
    <div className="max-w-6xl mx-auto px-4 py-8 text-slate-800">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 mb-8">
        <div>
          <button onClick={onBack} className="text-sm font-bold text-blue-600 hover:underline mb-2 block cursor-pointer">
            &larr; Back to Dashboard
          </button>
          <div className="flex items-center space-x-4">
            {!logoError ? (
              <img
                src={logoUrl}
                alt={`${report.companyName} logo`}
                onError={() => setLogoError(true)}
                className="w-14 h-14 rounded-2xl object-contain bg-white p-1 border border-slate-200"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                {report.ticker.substring(0, 2)}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-3.5">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">{report.companyName}</h2>
                <span className="bg-orange-50 text-orange-600 font-mono font-bold px-2.5 py-0.5 rounded-lg border border-orange-100 text-sm">
                  {report.ticker}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-bold">
                Research Compiled: {formatDatePolished(report.createdDate || report.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
          <button
            onClick={() => onDelete(report._id)}
            className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer shadow-sm"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AI Decision */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center flex flex-col justify-center items-center shadow-sm">
              <span className="text-xs text-slate-450 uppercase font-extrabold tracking-wider">AI Decision Verdict</span>
              <div className={`mt-3.5 py-2 px-6 rounded-full text-base font-black tracking-widest text-center inline-block ${getDecisionColor(report.recommendation)}`}>
                {(report.recommendation || 'PASS').replace('_', ' ')}
              </div>
            </div>

            {/* Confidence Score Progress Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-center shadow-sm">
              <div className="flex justify-between items-center text-xs text-slate-450 uppercase font-extrabold tracking-wider">
                <span>Confidence Rating</span>
                <span className="text-orange-600 font-black text-base">{report.confidenceScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3.5 overflow-hidden border border-slate-200 relative">
                <div
                  className="bg-gradient-to-r from-orange-400 to-orange-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${report.confidenceScore}%` }}
                ></div>
              </div>
            </div>

            {/* Data Sources Count */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center flex flex-col justify-center items-center shadow-sm">
              <span className="text-xs text-slate-450 uppercase font-extrabold tracking-wider">Live News Sources</span>
              <div className="text-3xl font-black text-emerald-600 mt-2">{(report.latestNews || report.news || []).length} Channels</div>
            </div>
          </div>

          {/* Company Overview Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-extrabold text-base text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center space-x-2">
              <Building2 className="w-4.5 h-4.5 text-orange-500" />
              <span>Company Overview Profile</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center space-x-3.5">
                <Globe className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-extrabold">Industry</div>
                  <div className="text-sm font-extrabold text-slate-700">{report.companyOverview?.industry || 'Technology'}</div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center space-x-3.5">
                <User className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-extrabold">CEO</div>
                  <div className="text-sm font-extrabold text-slate-700 truncate max-w-[90px]">{report.companyOverview?.ceo || 'Executive'}</div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center space-x-3.5">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-extrabold">Headquarters</div>
                  <div className="text-sm font-extrabold text-slate-700 truncate max-w-[100px]" title={report.companyOverview?.headquarters}>{report.companyOverview?.headquarters || 'Global HQ'}</div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center space-x-3.5">
                <Users className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-extrabold">Employees</div>
                  <div className="text-sm font-extrabold text-slate-700">{report.companyOverview?.employees || 'N/A'}</div>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed italic">
              {report.companyOverview?.description || report.aiSummary?.split('\n').find(l => l.startsWith('This dossier') || l.startsWith('This report')) || 'Company is categorized as a listed security asset.'}
            </p>
          </div>

          {/* AI Explanation / Core Catalysts & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Why Invest? Card */}
            <div className="bg-emerald-50/20 border border-emerald-250 p-6 rounded-2xl shadow-sm">
              <h3 className="font-extrabold text-base text-emerald-700 uppercase tracking-wider mb-4 flex items-center space-x-2.5">
                <ShieldCheck className="w-5.5 h-5.5 text-emerald-600" />
                <span>Why Invest? (Catalysts)</span>
              </h3>
              <ul className="space-y-3.5">
                {(report.opportunities || []).length > 0 ? (
                  report.opportunities.map((item, i) => (
                    <li key={i} className="text-sm text-slate-750 flex items-start space-x-2.5">
                      <span className="text-emerald-500 font-bold select-none mt-0.5">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="text-sm text-slate-750 flex items-start space-x-2.5">
                      <span className="text-emerald-500 font-bold mt-0.5">&bull;</span>
                      <span>Competitive market share advantages inside sector groups.</span>
                    </li>
                    <li className="text-sm text-slate-750 flex items-start space-x-2.5">
                      <span className="text-emerald-500 font-bold mt-0.5">&bull;</span>
                      <span>Strengthening operational margins from buyback triggers.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Potential Risks Card */}
            <div className="bg-red-50/20 border border-red-250 p-6 rounded-2xl shadow-sm">
              <h3 className="font-extrabold text-base text-red-700 uppercase tracking-wider mb-4 flex items-center space-x-2.5">
                <AlertOctagon className="w-5.5 h-5.5 text-red-500" />
                <span>Potential Risks & Headwinds</span>
              </h3>
              <ul className="space-y-3.5">
                {(report.risks || []).length > 0 ? (
                  report.risks.map((item, i) => (
                    <li key={i} className="text-sm text-slate-750 flex items-start space-x-2.5">
                      <span className="text-red-500 font-bold select-none mt-0.5">&bull;</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="text-sm text-slate-750 flex items-start space-x-2.5">
                      <span className="text-red-500 font-bold mt-0.5">&bull;</span>
                      <span>Competitive margin pressures and cost shifts.</span>
                    </li>
                    <li className="text-sm text-slate-750 flex items-start space-x-2.5">
                      <span className="text-red-500 font-bold mt-0.5">&bull;</span>
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
            <h4 className="text-sm font-extrabold text-slate-500 uppercase tracking-wider mb-4 flex items-center space-x-2.5">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
              <span>Core Financial Statement Scorecard</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Market Capitalization</div>
                <div className="text-lg font-black text-slate-800 mt-1">{formatValuation(report.financialData?.marketCap)}</div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">P/E Ratio</div>
                <div className="text-lg font-black text-slate-800 mt-1">{formatDecimal(report.financialData?.peRatio, 2)}</div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Debt to Equity</div>
                <div className="text-lg font-black text-slate-800 mt-1">{formatDecimal(report.financialData?.debtToEquity, 2)}</div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Earnings Per Share (EPS)</div>
                <div className="text-lg font-black text-slate-800 mt-1">{formatDecimal(report.financialData?.eps, 2)}</div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Revenue</div>
                <div className="text-lg font-black text-slate-800 mt-1">{formatValuation(report.financialData?.revenue)}</div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Net Income</div>
                <div className="text-lg font-black text-slate-800 mt-1">{formatValuation(report.financialData?.netIncome)}</div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Free Cash Flow</div>
                <div className="text-lg font-black text-slate-800 mt-1">{formatValuation(report.financialData?.freeCashFlow)}</div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Return on Equity (ROE)</div>
                <div className="text-lg font-black text-slate-800 mt-1">{formatPercent(report.financialData?.roe)}</div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Dividend Yield</div>
                <div className="text-lg font-black text-slate-800 mt-1">{formatPercent(report.financialData?.dividendYield)}</div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Current Ratio</div>
                <div className="text-lg font-black text-slate-800 mt-1">{formatDecimal(report.financialData?.currentRatio, 2)}</div>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Operating Margin</div>
                <div className="text-lg font-black text-slate-800 mt-1">{formatPercent(report.financialData?.operatingMargin)}</div>
              </div>
              <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl flex items-center space-x-2.5 shadow-sm">
                <Landmark className="w-5 h-5 text-blue-600" />
                <div className="text-[10px] text-blue-700 font-extrabold uppercase">Verified SEC Data</div>
              </div>
            </div>
          </div>

          {/* AI Analysis Markdown Container */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center space-x-2.5 text-blue-650 mb-5 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-extrabold text-base uppercase tracking-wider">Synthesized Analysis Report</h3>
            </div>
            <article className="prose max-w-none text-slate-700 space-y-4 text-base leading-relaxed whitespace-pre-wrap font-sans">
              {report.aiSummary}
            </article>
          </div>

        </div>

        {/* Sidebar Column: Interactive Q&A and News */}
        <div className="space-y-6">
          
          {/* Q&A Chat Side Drawer */}
          <div className="bg-white border border-slate-200 rounded-2xl flex flex-col h-[400px] overflow-hidden shadow-md">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-orange-500" />
              <span className="font-extrabold text-slate-700 text-sm">Interrogate Analysis</span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-medium">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-normal ${
                    msg.role === 'user' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/10' : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-slate-55 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask about details..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
              />
              <button type="submit" className="p-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl cursor-pointer transition-colors shadow-md shadow-orange-500/10">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Aggregated Clickable News List */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-450 uppercase tracking-wider mb-4">Aggregated News Context</h4>
            <div className="space-y-4.5">
              {(report.latestNews || report.news || []).map((item, idx) => (
                <a
                  key={idx}
                  href={item.url && item.url !== '#' ? item.url : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-slate-350 p-5 rounded-2xl text-xs space-y-2.5 transition-all shadow-sm group ${
                    item.url && item.url !== '#' ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">{item.source}</span>
                    <span className={`text-[9px] px-2.5 py-0.2 rounded-lg font-bold uppercase tracking-wide ${getSentimentBadge(item.sentiment)}`}>
                      {item.sentiment || 'NEUTRAL'}
                    </span>
                  </div>
                  <h5 className="font-extrabold text-slate-700 line-clamp-2 group-hover:text-orange-500 flex items-start justify-between text-sm leading-snug">
                    <span>{item.headline}</span>
                    {item.url && item.url !== '#' && (
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 ml-1.5 flex-shrink-0 transition-colors" />
                    )}
                  </h5>
                  <div className="text-[9px] text-slate-400 font-bold">
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
