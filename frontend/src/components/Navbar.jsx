import React from 'react';
import { Landmark, History, LineChart } from 'lucide-react';

/**
 * Navbar Component in Metallic Steel-Blue Theme
 */
export default function Navbar({ activePage, setActivePage }) {
  return (
    <nav className="bg-white/40 backdrop-blur-md border-b border-slate-200/50 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Brand Logo & Title */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActivePage('home')}>
        <div className="bg-blue-600 p-2 rounded text-white shadow-md shadow-blue-600/10">
          <Landmark className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-slate-850 tracking-wider leading-none m-0 font-mono">INSIDE_IIM</h1>
          <span className="text-[9px] text-blue-650 font-extrabold tracking-widest uppercase font-mono">INTEL.RESEARCH</span>
        </div>
      </div>

      {/* Navigation Options */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setActivePage('home')}
          className={`flex items-center space-x-2 px-4 py-2 rounded text-xs font-mono tracking-wider transition-all cursor-pointer ${
            activePage === 'home'
              ? 'bg-slate-900/10 text-slate-800 border border-slate-900/20'
              : 'text-slate-600 hover:text-slate-950 hover:bg-white/30'
          }`}
        >
          <LineChart className="w-3.5 h-3.5" />
          <span>NEW_ANALYSIS</span>
        </button>

        <button
          onClick={() => setActivePage('history')}
          className={`flex items-center space-x-2 px-4 py-2 rounded text-xs font-mono tracking-wider transition-all cursor-pointer ${
            activePage === 'history'
              ? 'bg-slate-900/10 text-slate-800 border border-slate-900/20'
              : 'text-slate-600 hover:text-slate-950 hover:bg-white/30'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>RESEARCH_HISTORY</span>
        </button>
      </div>

      {/* User Status / Quick Info */}
      <div className="flex items-center space-x-3">
        <div className="text-right hidden sm:block">
          <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest font-mono">STATUS: CONNECTED</div>
          <div className="text-xs font-bold text-slate-700 font-mono">analyst@insideiim.com</div>
        </div>
        <div className="w-7 h-7 rounded bg-slate-900/10 border border-slate-900/20 flex items-center justify-center text-slate-700 font-bold text-xs font-mono">
          A
        </div>
      </div>
    </nav>
  );
}
