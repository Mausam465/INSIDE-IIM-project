import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Loading from './pages/Loading';
import AnalysisReport from './pages/AnalysisReport';
import History from './pages/History';

const API_BASE_URL = 'http://localhost:5000/api';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [tickerToAnalyze, setTickerToAnalyze] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [modalError, setModalError] = useState(null);

  // Helper to clear token on authentication failure
  const handleAuthError = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  // Automatically registers a default analyst profile to acquire a token if none is present.
  useEffect(() => {
    const acquireDefaultToken = async () => {
      if (token) return;

      try {
        const email = `analyst_${Math.floor(Math.random() * 100000)}@insideiim.com`;
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: 'password123' })
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        }
      } catch (err) {
        console.warn('Backend server offline. Running in local mock mode.', err.message);
      }
    };

    acquireDefaultToken();
  }, [token]);

  // Load reports list from backend
  const fetchReports = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        handleAuthError();
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setReports(data);
      }
    } catch (err) {
      console.warn('Failed to fetch from backend. Reverting to static mocks.', err.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReports();
    }
  }, [token]);

  // Triggers report generation pipeline
  const handleStartAnalysis = ({ ticker, query }) => {
    setTickerToAnalyze(ticker);
    setActiveQuery(query);
    setActivePage('loading');
  };

  // Handles loading completion: queries the API and saves the new report
  const handleLoadingComplete = async () => {
    try {
      if (token) {
        const res = await fetch(`${API_BASE_URL}/reports`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ ticker: tickerToAnalyze, query: activeQuery })
        });

        if (res.status === 401) {
          handleAuthError();
          setModalError('Session expired. Please start your search again.');
          setActivePage('home');
          return;
        }

        if (!res.ok) {
          const errorData = await res.json();
          setModalError(errorData.message || 'Failed to generate report.');
          setActivePage('home');
          return;
        }

        const newReport = await res.json();
        if (newReport && newReport._id) {
          setReports((prev) => [newReport, ...prev]);
          setCurrentReport(newReport);
          setActivePage('report');
          return;
        }
      }
    } catch (err) {
      console.warn('Network error while posting report. Using fallback mock.', err.message);
      setModalError('Network error connecting to the backend. Please ensure the server is active.');
      setActivePage('home');
      return;
    }

    // Fallback Mock report if backend is disconnected entirely
    const fallbackReport = {
      _id: `mock_${Date.now()}`,
      ticker: tickerToAnalyze.toUpperCase(),
      companyName: tickerToAnalyze === 'AAPL' ? 'Apple Inc.' : tickerToAnalyze === 'TSLA' ? 'Tesla Motors' : `${tickerToAnalyze} Corporation`,
      query: activeQuery,
      financialData: { peRatio: 30.2, marketCap: 180000000000, debtToEquity: 0.8 },
      latestNews: [
        { headline: 'Market optimistic on product expansion plans', source: 'Financial Times', url: '#' },
        { headline: 'Supply chain headwinds signal Q4 concerns', source: 'Bloomberg', url: '#' }
      ],
      aiSummary: `# Analysis Report: ${tickerToAnalyze}\n\n*Note: Running in offline fallback mode.*\n\n### Overview\nThe asset is showing strong support lines around key levels...`,
      recommendation: 'PASS',
      confidenceScore: 82,
      createdDate: new Date().toISOString()
    };

    setReports((prev) => [fallbackReport, ...prev]);
    setCurrentReport(fallbackReport);
    setActivePage('report');
  };

  const handleViewReport = (report) => {
    setCurrentReport(report);
    setActivePage('report');
  };

  const handleDeleteReport = async (reportId) => {
    try {
      if (token && !reportId.startsWith('mock_')) {
        await fetch(`${API_BASE_URL}/reports/${reportId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.warn('Failed to delete report from backend server.', err.message);
    }

    setReports((prev) => prev.filter((r) => r._id !== reportId));
    setActivePage('home');
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800 flex flex-col relative overflow-x-hidden">
      {/* Navigation Header */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Terminal Window Router */}
      <main className="flex-grow z-10 relative">
        {activePage === 'home' && (
          <Home onSearch={handleStartAnalysis} />
        )}
        
        {activePage === 'loading' && (
          <Loading ticker={tickerToAnalyze} onComplete={handleLoadingComplete} />
        )}

        {activePage === 'report' && currentReport && (
          <AnalysisReport
            report={currentReport}
            onBack={() => setActivePage('home')}
            onDelete={handleDeleteReport}
          />
        )}

        {activePage === 'history' && (
          <History
            reports={reports}
            onViewReport={handleViewReport}
            onDeleteReport={handleDeleteReport}
          />
        )}
      </main>

      {/* Custom Modal Notification Box */}
      {modalError && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white border border-orange-100 rounded-2xl p-7 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mx-auto text-orange-500 border border-orange-100">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Notification</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                {modalError}
              </p>
            </div>
            <button
              onClick={() => setModalError(null)}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-sm shadow-sm"
            >
              Dismiss Message
            </button>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="border-t border-slate-200/50 py-6 text-center text-xs text-slate-500 bg-white/50 backdrop-blur-md shadow-inner select-none font-medium">
        &copy; {new Date().getFullYear()} INSIDE-IIM. Institutional Grade Investment Intelligence.
      </footer>
    </div>
  );
}
