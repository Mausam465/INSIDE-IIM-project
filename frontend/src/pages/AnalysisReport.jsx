import React, { useState } from 'react';
import { Download, MessageSquare, Sparkles, Send, Trash2, Globe } from 'lucide-react';

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
        content: `Regarding "${userMsg.content}": Based on the data collected, ${report.companyName}'s current debt profile remains stable at a Debt-to-Equity of ${report.financialData.debtToEquity || 'N/A'}, supported by positive cash flows.`
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  const getDecisionColor = (decision) => {
    const d = (decision || '').toUpperCase();
    switch (d) {
      case 'STRONG_BUY':
      case 'BUY':
      case 'INVEST':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25';
      case 'SELL':
      case 'STRONG_SELL':
      case 'PASS':
        return 'bg-red-500/10 text-red-400 border border-red-500/25';
      case 'HOLD':
      default:
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/25';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#334155]/40 pb-6 mb-8">
        <div>
          <button onClick={onBack} className="text-sm text-blue-400 hover:underline mb-2 block">
            &larr; Back to Dashboard
          </button>
          <div className="flex items-center space-x-3">
            <span className="bg-blue-600/15 text-blue-400 font-mono font-bold px-3 py-1 rounded-lg border border-blue-500/30 text-lg">
              {report.ticker}
            </span>
            <h2 className="text-3xl font-extrabold text-white">{report.companyName}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Research compiled on: {new Date(report.createdDate || report.searchDate).toLocaleDateString()}
          </p>
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
        {/* Main Columns: Scores, Metrics, & Report */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Scoring Banner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* AI Decision */}
            <div className="bg-[#1e293b]/20 border border-[#334155]/40 rounded-xl p-5 text-center">
              <span className="text-xs text-slate-400 uppercase font-semibold">AI Recommendation</span>
              <div className={`mt-2 py-1 px-3 rounded-full text-sm font-bold text-center inline-block ${getDecisionColor(report.recommendation || report.investmentDecision)}`}>
                {(report.recommendation || report.investmentDecision || 'HOLD').replace('_', ' ')}
              </div>
            </div>

            {/* Confidence Score */}
            <div className="bg-[#1e293b]/20 border border-[#334155]/40 rounded-xl p-5 text-center">
              <span className="text-xs text-slate-400 uppercase font-semibold">Confidence Score</span>
              <div className="text-2xl font-black text-blue-400 mt-1">{report.confidenceScore}%</div>
            </div>

            {/* Data Sources Count */}
            <div className="bg-[#1e293b]/20 border border-[#334155]/40 rounded-xl p-5 text-center">
              <span className="text-xs text-slate-400 uppercase font-semibold">Live News Sources</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">{(report.latestNews || report.news || []).length} Channels</div>
            </div>
          </div>

          {/* Financial Metrics Grid */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Core Financial Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[#0b0f19] border border-[#1e293b] p-4 rounded-xl">
                <div className="text-xs text-slate-400">P/E Ratio</div>
                <div className="text-lg font-bold text-white mt-1">{report.financialData?.peRatio || 'N/A'}</div>
              </div>
              <div className="bg-[#0b0f19] border border-[#1e293b] p-4 rounded-xl">
                <div className="text-xs text-slate-400">Market Capitalization</div>
                <div className="text-lg font-bold text-white mt-1">
                  {report.financialData?.marketCap ? `$${(report.financialData.marketCap / 1e9).toFixed(1)}B` : 'N/A'}
                </div>
              </div>
              <div className="bg-[#0b0f19] border border-[#1e293b] p-4 rounded-xl">
                <div className="text-xs text-slate-400">Debt to Equity</div>
                <div className="text-lg font-bold text-white mt-1">{report.financialData?.debtToEquity || 'N/A'}</div>
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
              {report.aiSummary || report.aiAnalysis || report.reportMarkdown}
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

          {/* Aggregated News List */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Aggregated News Context</h4>
            <div className="space-y-3">
              {(report.latestNews || report.news || []).map((item, idx) => (
                <div key={idx} className="bg-[#0b0f19] border border-[#1e293b] p-4 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium">{item.source}</span>
                  </div>
                  <h5 className="font-semibold text-slate-200 line-clamp-2">{item.headline}</h5>
                  {item.url && item.url !== '#' && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline block text-[10px]"
                    >
                      Read article &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
