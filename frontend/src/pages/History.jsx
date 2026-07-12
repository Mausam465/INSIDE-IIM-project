import React, { useState } from 'react';
import { Search, Eye, FileText } from 'lucide-react';

/**
 * History Component in Warm Cream-Beige Theme
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
    <div className="max-w-6xl mx-auto px-4 py-12">
      
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Research Database</h2>
          <p className="text-slate-500 text-sm mt-1">
            Access and query all generated investment research dossiers.
          </p>
        </div>

        {/* Filter Input */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search database..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">No reports found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            {searchTerm ? `No reports match your search query: "${searchTerm}"` : 'You have not run any reports yet. Go to New Analysis to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((report) => {
            const domain = getDomainFromCompanyName(report.companyName);
            const logoUrl = `https://logo.clearbit.com/${domain}`;
            const hasLogoError = logoErrors[report._id];

            return (
              <div
                key={report._id}
                className="bg-white hover:bg-slate-50/20 border border-slate-200 rounded-2xl p-6 transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {!hasLogoError ? (
                        <img
                          src={logoUrl}
                          alt={`${report.companyName} logo`}
                          onError={() => handleLogoError(report._id)}
                          className="w-8 h-8 rounded-lg object-contain bg-slate-50 p-1 border border-slate-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-xs">
                          {report.ticker.substring(0, 2)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-orange-50 text-orange-600 font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-orange-100">
                            {report.ticker}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {formatDatePolished(report.createdDate || report.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold tracking-wider uppercase ${getDecisionColor(report.recommendation)}`}>
                      {(report.recommendation || 'PASS').replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-slate-800 font-extrabold text-base mb-1.5">{report.companyName}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{report.query}</p>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex space-x-4 text-xs text-slate-500">
                    <div>
                      P/E: <span className="font-bold text-slate-800">{report.financialData?.peRatio ? parseFloat(report.financialData.peRatio).toFixed(2) : 'N/A'}</span>
                    </div>
                    <div>
                      Confidence: <span className="font-bold text-orange-600">{report.confidenceScore}%</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewReport(report)}
                      className="flex items-center space-x-1.5 bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-orange-100 hover:border-orange-500 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Dossier</span>
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
