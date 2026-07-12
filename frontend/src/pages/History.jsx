import React, { useState } from 'react';
import { Search, Eye, TrendingUp, AlertCircle, FileText } from 'lucide-react';

/**
 * History Component
 * Displays a list of all historical reports run by the authenticated analyst.
 */
export default function History({ reports, onViewReport, onDeleteReport }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter(
    (r) =>
      r.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDecisionColor = (decision) => {
    switch (decision) {
      case 'STRONG_BUY':
      case 'BUY':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25';
      case 'SELL':
      case 'STRONG_SELL':
        return 'bg-red-500/10 text-red-400 border border-red-500/25';
      case 'HOLD':
      default:
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/25';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#334155]/40 pb-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Research Database</h2>
          <p className="text-slate-400 text-sm mt-1">
            Access and query all generated investment research dossiers.
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ticker or company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1e293b]/40 border border-[#334155] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-[#1e293b]/10 border border-dashed border-[#334155]/60 rounded-2xl p-12 text-center">
          <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">No reports found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {searchTerm ? `No reports match your search query: "${searchTerm}"` : 'You have not run any reports yet. Go to New Analysis to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => (
            <div
              key={report._id}
              className="bg-[#1e293b]/20 hover:bg-[#1e293b]/50 border border-[#334155]/40 rounded-xl p-5 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-600/10 text-blue-400 font-mono font-bold text-xs px-2.5 py-0.5 rounded border border-blue-500/20">
                      {report.ticker}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(report.searchDate).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${getDecisionColor(report.investmentDecision)}`}>
                    {report.investmentDecision.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="text-slate-100 font-bold text-base mb-1">{report.companyName}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">{report.query}</p>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-[#334155]/30">
                <div className="flex space-x-4 text-[11px] text-slate-400">
                  <div>
                    Sentiment: <span className="font-bold text-emerald-400">{(report.sentimentScore * 100).toFixed(0)}%</span>
                  </div>
                  <div>
                    Confidence: <span className="font-bold text-blue-400">{report.confidenceScore}%</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onViewReport(report)}
                    className="flex items-center space-x-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border border-blue-500/20"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
