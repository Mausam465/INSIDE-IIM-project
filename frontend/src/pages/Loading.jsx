import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

/**
 * Loading Component (AI Stepper Status Indicator) in Warm Cream-Beige Theme
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
    <div className="max-w-2xl mx-auto px-4 py-24 text-center relative">
      {/* Visual Spinner */}
      <div className="flex justify-center mb-8">
        <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
      </div>

      <h3 className="text-3xl font-extrabold text-slate-800 mb-2">Analyzing {ticker}</h3>
      <p className="text-slate-500 text-sm mb-12">
        Please wait. Our AI Agent is gathering live data and compiling the report.
      </p>

      {/* Steps List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-left max-w-lg mx-auto space-y-5 shadow-lg">
        {steps.map((step, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep;

          return (
            <div
              key={idx}
              className={`flex items-start space-x-4 transition-opacity duration-300 ${
                isActive ? 'opacity-100' : isCompleted ? 'opacity-70' : 'opacity-40'
              }`}
            >
              <div className="mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="w-5.5 h-5.5 text-emerald-500 flex-shrink-0" />
                ) : isActive ? (
                  <Loader2 className="w-5.5 h-5.5 text-orange-500 animate-spin flex-shrink-0" />
                ) : (
                  <Circle className="w-5.5 h-5.5 text-slate-300 flex-shrink-0" />
                )}
              </div>
              <div>
                <p className={`text-sm font-bold ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>
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
