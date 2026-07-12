import React from 'react';
import { Landmark, History, LineChart } from 'lucide-react';

/**
 * Navbar Component in Warm Cream-Beige Theme
 */
export default function Navbar({ activePage, setActivePage }) {
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Brand Logo & Title */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActivePage('home')}>
        <div className="bg-orange-500 p-2.5 rounded-xl text-white shadow-md shadow-orange-500/10">
          <Landmark className="w-5.5 h-5.5" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none m-0">INSIDE-IIM</h1>
          <span className="text-[10px] text-orange-600 font-extrabold tracking-widest uppercase mt-0.5 block">Research Terminal</span>
        </div>
      </div>

      {/* Navigation Options */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setActivePage('home')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activePage === 'home'
              ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm'
              : 'text-slate-650 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <LineChart className="w-4 h-4" />
          <span>New Analysis</span>
        </button>

        <button
          onClick={() => setActivePage('history')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activePage === 'history'
              ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm'
              : 'text-slate-650 hover:text-slate-900 hover:bg-slate-50/50'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Research History</span>
        </button>
      </div>

      {/* User Status / Quick Info */}
      <div className="flex items-center space-x-3">
        <div className="text-right hidden sm:block">
          <div className="text-[9px] text-slate-450 font-bold uppercase tracking-wider">Status: Online</div>
          <div className="text-sm font-bold text-slate-700">analyst@insideiim.com</div>
        </div>
        <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-orange-500/10">
          A
        </div>
      </div>
    </nav>
  );
}
