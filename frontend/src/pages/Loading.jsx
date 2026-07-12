import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

/**
 * Loading Component (AI Stepper Status Indicator) in Metallic Steel-Blue Theme
 */
export default function Loading({ ticker, onComplete }) {
  const steps = [
    'Connecting to financial services & SEC databases...',
    'Fetching key ratios, balance sheets, and cash flow history...',
    'Aggregating live news headlines and computing sentiment scores...',
    'Google Gemini synthesizing research analysis and formatting report...'
  ];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) {
            onComplete();
          }
          return prev;
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center relative">
      {/* Visual Spinner */}
      <div className="flex justify-center mb-8">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
      </div>

      <div className="text-[10px] text-slate-500 font-mono font-bold tracking-widest mb-2 uppercase">
        BATCH_PROG // COMPILING_DOSSIER
      </div>
      <h3 className="text-2xl font-extrabold text-slate-800 mb-2 font-mono uppercase tracking-wider">Analyzing {ticker}</h3>
      <p className="text-slate-500 text-xs font-mono tracking-wide mb-10">
        Please wait. Our AI Agent is gathering live data and compiling the report.
      </p>

      {/* Steps List */}
      <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-xl p-6 text-left max-w-lg mx-auto space-y-4 shadow-md relative">
        <span className="absolute top-2 left-2 text-slate-400/20 text-xs font-mono font-bold select-none">+</span>
        <span className="absolute top-2 right-2 text-slate-400/20 text-xs font-mono font-bold select-none">+</span>
        <span className="absolute bottom-2 left-2 text-slate-400/20 text-xs font-mono font-bold select-none">+</span>
        <span className="absolute bottom-2 right-2 text-slate-400/20 text-xs font-mono font-bold select-none">+</span>

        {steps.map((step, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep;

          return (
            <div
              key={idx}
              className={`flex items-start space-x-3 transition-opacity duration-300 ${
                isActive ? 'opacity-100' : isCompleted ? 'opacity-70' : 'opacity-40'
              }`}
            >
              <div className="mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0" />
                ) : isActive ? (
                  <Loader2 className="w-4.5 h-4.5 text-blue-600 animate-spin flex-shrink-0" />
                ) : (
                  <Circle className="w-4.5 h-4.5 text-slate-300 flex-shrink-0" />
                )}
              </div>
              <div>
                <p className={`text-xs font-mono ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>
                  [{idx.toString().padStart(2, '0')}] {step}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
