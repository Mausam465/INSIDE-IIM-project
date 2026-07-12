import React, { useState, useEffect } from 'react';
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
          throw new Error('Authentication expired');
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
    }

    // Fallback Mock report if backend is disconnected
    const fallbackReport = {
      _id: `mock_${Date.now()}`,
      ticker: tickerToAnalyze,
      companyName: tickerToAnalyze === 'AAPL' ? 'Apple Inc.' : tickerToAnalyze === 'TSLA' ? 'Tesla Motors' : `${tickerToAnalyze} Corporation`,
      query: activeQuery,
      financialData: { peRatio: 30.2, marketCap: 180000000000, debtToEquity: 0.8 },
      latestNews: [
        { headline: 'Market optimistic on product expansion plans', source: 'Financial Times', url: '#' },
        { headline: 'Supply chain headwinds signal Q4 concerns', source: 'Bloomberg', url: '#' }
      ],
      aiSummary: `# Analysis Report: ${tickerToAnalyze}\n\n*Note: Running in offline fallback mode.*\n\n### Overview\nThe asset is showing strong support lines around key levels...`,
      recommendation: 'BUY',
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
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      {/* Navigation Header */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Terminal Window Router */}
      <main className="flex-grow">
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

      {/* Footer Branding */}
      <footer className="border-t border-[#1e293b] py-6 text-center text-xs text-slate-500 bg-[#0f172a]/40">
        &copy; {new Date().getFullYear()} INSIDE-IIM. Institutional Grade Investment Intelligence.
      </footer>
    </div>
  );
}
