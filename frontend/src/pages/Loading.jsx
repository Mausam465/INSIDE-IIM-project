import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

/**
 * Loading Component (AI Stepper Status Indicator)
 * Displays active progress to the user while the LangChain agent runs background tasks.
 * 
 * React Concept: useEffect Hook
 * - Runs side-effects (like a setInterval timer) after mounting.
 * - Cleans up the interval timer on unmount to prevent memory leaks.
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
    // Increment loading step every 3 seconds to simulate progression
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Callback to parent once simulation ends (or when actual REST response finishes)
          if (onComplete) {
            onComplete();
          }
          return prev;
        }
      });
    }, 3000);

    return () => clearInterval(interval); // Cleanup function
  }, [onComplete]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      {/* Visual Spinner */}
      <div className="flex justify-center mb-8">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">Analyzing {ticker}</h3>
      <p className="text-slate-400 text-sm mb-10">
        Please wait. Our AI Agent is gathering live data and compiling the report.
      </p>

      {/* Steps List */}
      <div className="bg-[#1e293b]/30 border border-[#334155]/40 rounded-2xl p-6 text-left max-w-lg mx-auto space-y-4">
        {steps.map((step, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep;

          return (
            <div
              key={idx}
              className={`flex items-start space-x-3 transition-opacity duration-300 ${
                isActive ? 'opacity-100' : isCompleted ? 'opacity-80' : 'opacity-40'
              }`}
            >
              <div className="mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {step}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
