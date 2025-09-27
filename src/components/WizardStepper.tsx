"use client";
import React from 'react';
import { Steps } from '../steps/types';

const stepLabels: Record<Steps, string> = {
  [Steps.Form]: 'Form',
  [Steps.SingleArticleForm]: 'Single Article',
  [Steps.ExcelArticleForm]: 'Excel Import',
  [Steps.Generating]: 'Generating',
  [Steps.Success]: 'Success',
  [Steps.Error]: 'Error',
  [Steps.SuggestionTable]: 'Suggestions',
};

export interface WizardStepperProps {
  currentStep: Steps;
}

export const WizardStepper: React.FC<WizardStepperProps> = ({ currentStep }) => {
  const steps = Object.values(Steps);
  const currentIdx = steps.indexOf(currentStep);

  return (
    <nav className="wizard-stepper sticky top-16 z-20 w-full mb-4">
      <ol className="flex justify-center items-center gap-6 py-6">
        {steps.map((step, idx) => (
          <li key={step} className="flex items-center">
            <span
              className={`step-circle ${idx <= currentIdx ? 'active' : ''}`}
            >
              {idx + 1}
            </span>
            <span className="step-label ml-2 text-base font-semibold tracking-wide">
              {stepLabels[step]}
            </span>
            {idx < steps.length - 1 && (
              <span className="step-line mx-4 h-1 w-10 bg-gradient-to-r from-blue-300 to-green-200" />
            )}
          </li>
        ))}
      </ol>
      <style jsx>{`
        .step-circle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e0e7ef;
          color: #333;
          font-weight: bold;
          font-size: 1.1rem;
          box-shadow: 0 2px 8px rgba(59,130,246,0.08);
          transition: background 0.3s, color 0.3s, box-shadow 0.3s;
        }
        .step-circle.active {
          background: linear-gradient(90deg, #6ee7b7 0%, #3b82f6 100%);
          color: #fff;
          box-shadow: 0 4px 16px rgba(59,130,246,0.15);
        }
        .step-line {
          display: inline-block;
        }
      `}</style>
    </nav>
  );
};
