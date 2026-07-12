import React, { useState } from 'react';
import { Search, Eye, FileText } from 'lucide-react';

/**
 * History Component in Metallic Steel-Blue Theme
 */
export default function History({ reports, onViewReport, onDeleteReport }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [logoErrors, setLogoErrors] = useState({});

  const filteredReports = reports.filter(
    (r) =>
      r.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatDatePolished = (dateInput) => {
    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getDomainFromCompanyName = (name) => {
    const cleanName = name
      .toLowerCase()
      .replace(/inc\.|corp\.|corporation|ltd\./gi, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
    return `${cleanName}.com`;
  };

  const handleLogoError = (id) => {
    setLogoErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-6 mb-8">
        <div>
          <div className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase">
            SEC_LOGS // DATABASE
          </div>
          <h2 className="text-2xl font-black text-slate-800 font-mono uppercase tracking-wider mt-1">Research Database</h2>
          <p className="text-slate-500 text-xs font-mono tracking-wide mt-1">
            Access and query all generated investment research dossiers.
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="FILTER_BY_TICKER_OR_NAME..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded pl-10 pr-4 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white/60 border border-dashed border-slate-350 rounded-xl p-12 text-center relative shadow-sm">
          <span className="absolute top-2 left-2 text-slate-400/20 text-xs font-mono font-bold select-none">+</span>
          <span className="absolute top-2 right-2 text-slate-400/20 text-xs font-mono font-bold select-none">+</span>
          
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-700 font-mono uppercase tracking-wider">No files found</h3>
          <p className="text-slate-500 text-xs font-mono mt-1">
            {searchTerm ? `No database logs match: "${searchTerm}"` : 'Database contains 0 compiled stock dossiers.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => {
            const domain = getDomainFromCompanyName(report.companyName);
            const logoUrl = `https://logo.clearbit.com/${domain}`;
            const hasLogoError = logoErrors[report._id];

            return (
              <div
                key={report._id}
                className="bg-white/60 hover:bg-white border border-slate-200 rounded p-5 transition-all flex flex-col justify-between shadow-sm hover:shadow-md relative group"
              >
                {/* Coordinate crosshairs */}
                <span className="absolute top-1.5 left-2 text-slate-400/20 text-[8px] font-mono select-none">+</span>
                <span className="absolute top-1.5 right-2 text-slate-400/20 text-[8px] font-mono select-none">+</span>
                <span className="absolute bottom-1.5 left-2 text-slate-400/20 text-[8px] font-mono select-none">+</span>
                <span className="absolute bottom-1.5 right-2 text-slate-400/20 text-[8px] font-mono select-none">+</span>

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {!hasLogoError ? (
                        <img
                          src={logoUrl}
                          alt={`${report.companyName} logo`}
                          onError={() => handleLogoError(report._id)}
                          className="w-7 h-7 rounded object-contain bg-white p-1 border border-slate-200"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-[10px] font-mono">
                          {report.ticker.substring(0, 2)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-50 text-blue-600 font-mono font-bold text-[9px] px-2 py-0.5 rounded border border-blue-100">
                            {report.ticker}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono font-bold">
                            {formatDatePolished(report.createdDate || report.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[9px] px-2.5 py-0.5 rounded font-mono font-bold tracking-wider uppercase ${getDecisionColor(report.recommendation)}`}>
                      {(report.recommendation || 'PASS').replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-slate-800 font-bold text-sm font-mono mb-1">{report.companyName}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mb-4 font-mono leading-relaxed">{report.query}</p>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex space-x-4 text-[10px] font-mono text-slate-550">
                    <div>
                      P/E: <span className="font-bold text-slate-800">{report.financialData?.peRatio ? parseFloat(report.financialData.peRatio).toFixed(2) : 'N/A'}</span>
                    </div>
                    <div>
                      CONF: <span className="font-bold text-blue-600">{report.confidenceScore}%</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewReport(report)}
                      className="flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-3 py-1.5 rounded text-[10px] font-mono tracking-wider transition-all border border-blue-100 hover:border-blue-600 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>OPEN_DOSSIER</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
