"use client";
import { useState } from 'react';
import { ErrorStep } from '../src/steps/ErrorStep';
import ExcelFormStep from '../src/steps/ExcelFormStep';
import FormStep from '../src/steps/FormStep';
import GeneratingStep from '../src/steps/GeneratingStep';
import SingleArticleFormStep from '../src/steps/SingleArticleFormStep';
import { StepsContext } from '../src/steps/StepsContext';
import SuccessStep from '../src/steps/SuccessStep';
import SuggestionTableStep from '../src/steps/SuggestionTableStep';
import { GenerationStepState, Steps } from '../src/steps/types';
import { WizardStepper } from '../src/components/WizardStepper';

export default function Page() {
  const [commonConfig, setCommonConfig] = useState<any>({
    contentLLMVersion: 'grok-3-mini',
  });

  const [currentStep, setCurrentStep] = useState<GenerationStepState>({
    step: Steps.Form,
  });

  // Progress bar calculation
  const stepsOrder = [Steps.Form, Steps.SingleArticleForm, Steps.ExcelArticleForm, Steps.Generating, Steps.SuggestionTable, Steps.Success, Steps.Error];
  const currentIdx = stepsOrder.indexOf(currentStep.step);
  const progress = ((currentIdx + 1) / stepsOrder.length) * 100;

  return (
    <div
      className="min-h-screen flex flex-col bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <header className="w-full py-3 px-6 bg-white/70 backdrop-blur-md shadow-md flex items-center justify-center sticky top-0 z-10">
        <h1 className="text-2xl text-gray-800 bodoni-moda-regular">Syntia's Construction Writer</h1>
      </header>
      <main className="flex-1 flex items-center justify-center py-8 px-2">
        <div className={`w-full mx-auto ${currentStep.step === Steps.Form ? "bg-white/50 backdrop-blur-md" : "bg-white"} ${currentStep.step === Steps.Success ? "max-w-7xl" : "max-w-4xl"} shadow-lg rounded-2xl p-4 md:p-8`}>
          {/* Progress Bar Slider with Step Labels */}
          <div className="w-full mb-8">
            <div className="relative w-full h-1 bg-gray-200 rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-600 mt-2 px-1">
              <span className={currentIdx === 0 ? 'text-blue-500' : ''}>Select Mode</span>
              <span className={currentIdx === 1 ? 'text-blue-500' : ''}>Configure</span>
              <span className={currentIdx >= 2 ? 'text-blue-500' : ''}>Generate</span>
            </div>
          </div>
          {/* Wizard Form Content */}
          <StepsContext.Provider value={{ moveToStep: setCurrentStep }}>
            {currentStep.step === Steps.Form && (
              <div className="flex items-center justify-center">
                <FormStep
                  initialConfig={commonConfig}
                  saveConfig={setCommonConfig}
                />
              </div>
            )}
            {currentStep.step === Steps.SingleArticleForm && (
              <SingleArticleFormStep initialConfig={commonConfig} />
            )}
            {currentStep.step === Steps.ExcelArticleForm && (
              <ExcelFormStep initialConfig={commonConfig} />
            )}
            {currentStep.step === Steps.Generating && (
              <GeneratingStep
                config={commonConfig}
                data={currentStep.data}
              />
            )}
            {currentStep.step === Steps.SuggestionTable && (
              <SuggestionTableStep config={commonConfig} />
            )}
            {currentStep.step === Steps.Success && (
              <SuccessStep {...currentStep.result} />
            )}
            {currentStep.step === Steps.Error && (
              <ErrorStep {...currentStep.result} />
            )}
          </StepsContext.Provider>
        </div>
        <style jsx global>{`
          .wizard-form {
            background: rgba(255,255,255,0.95);
            border-radius: 1rem;
            box-shadow: 0 4px 32px rgba(59,130,246,0.08);
            padding: 2rem;
            margin: 0 auto;
          }
          .wizard-form label, .wizard-form input, .wizard-form select, .wizard-form textarea {
            color: #222;
          }
        `}</style>
      </main>
    </div>
  );
}
