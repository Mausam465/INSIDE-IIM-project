import React from 'react';
import { Landmark, History, LineChart } from 'lucide-react';

/**
 * Navbar Component
 * Renders the top navigation header for the Investment Research Terminal in a polished light theme.
 */
export default function Navbar({ activePage, setActivePage }) {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Brand Logo & Title */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActivePage('home')}>
        <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md shadow-blue-600/10">
          <Landmark className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-[#0f172a] tracking-tight leading-none m-0">INSIDE-IIM</h1>
          <span className="text-[10px] text-blue-600 font-extrabold tracking-wider uppercase">Research Terminal</span>
        </div>
      </div>

      {/* Navigation Options */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setActivePage('home')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activePage === 'home'
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <LineChart className="w-4 h-4" />
          <span>New Analysis</span>
        </button>

        <button
          onClick={() => setActivePage('history')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activePage === 'history'
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Research History</span>
        </button>
      </div>

      {/* User Status / Quick Info */}
      <div className="flex items-center space-x-3">
        <div className="text-right hidden sm:block">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Authenticated as</div>
          <div className="text-sm font-bold text-slate-700">analyst@insideiim.com</div>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-blue-600/20">
          A
        </div>
      </div>
    </nav>
  );
}
