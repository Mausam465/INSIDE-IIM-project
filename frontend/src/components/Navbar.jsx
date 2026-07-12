import React from 'react';
import { Landmark, TrendingUp, History, LineChart } from 'lucide-react';

/**
 * Navbar Component
 * Renders the top navigation header for the Investment Research Terminal.
 * 
 * React Concept: Props
 * - `activePage`: String representation of the current active page. Used to highlight the active menu option.
 * - `setActivePage`: Callback function passed from App.jsx to change the active page state on user click.
 */
export default function Navbar({ activePage, setActivePage }) {
  return (
    <nav className="bg-[#0f172a] border-b border-[#1e293b] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Brand Logo & Title */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActivePage('home')}>
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Landmark className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight leading-none m-0">INSIDE-IIM</h1>
          <span className="text-xs text-blue-400 font-semibold tracking-wider uppercase">Research Terminal</span>
        </div>
      </div>

      {/* Navigation Options */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setActivePage('home')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activePage === 'home'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]'
          }`}
        >
          <LineChart className="w-4 h-4" />
          <span>New Analysis</span>
        </button>

        <button
          onClick={() => setActivePage('history')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activePage === 'history'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Research History</span>
        </button>
      </div>

      {/* User Status / Quick Info */}
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="text-xs text-slate-400">Authenticated as</div>
          <div className="text-sm font-medium text-slate-200">analyst@insideiim.com</div>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          A
        </div>
      </div>
    </nav>
  );
}
