import { useContext } from 'react';
import { useForm } from 'react-hook-form';

import { GenerationOptionValues } from '../utils/constants';
import { StepsContext } from './StepsContext';
import { GenerationOptions, Steps } from './types';

const ArticleGenerationOptions: { label: string; value: GenerationOptions }[] =
  [
    { label: 'Single Article', value: GenerationOptionValues.viaUI },
    {
      label: 'Multiple Aricles via Google Sheet',
      value: GenerationOptionValues.viaExcel,
    },
    {
      label: 'Multiple Articles via Word Finder',
      value: GenerationOptionValues.viaSuggestionTable,
    },
  ];

const contentLLMVersionOptions: {
  label: string;
  value: any;
}[] = [
  { label: 'grok-3-mini', value: 'grok-3-mini' },
];

const FormStep = ({
  initialConfig,
  saveConfig,
}: {
  initialConfig: any;
  saveConfig: (data: any) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<
    any & {
      generationOptions: GenerationOptions;
    }
  >({
    values: {
      ...initialConfig,
      generationOptions: GenerationOptionValues.viaUI,
    },
    mode: 'onChange',
  });

  const { moveToStep } = useContext(StepsContext);

  const onSubmit = async (
    data: any & {
      generationOptions: GenerationOptions;
    }
  ) => {
    const { generationOptions, ...config } = data;
    saveConfig(config);
    // user can choose to generate articles via suggestion table(word finder prompt)
    if (generationOptions === GenerationOptionValues.viaSuggestionTable) {
      return moveToStep({
        step: Steps.SuggestionTable,
        any: {}, // Provide an appropriate value for 'any' as needed
      });
    }
    // user can choose to generate article via single article step
    if (generationOptions === GenerationOptionValues.viaUI) {
      return moveToStep({
        step: Steps.SingleArticleForm,
        any: {}, // Provide an appropriate value for 'any' as needed
        generationOptions: generationOptions,
      });
    }
    // user can choose to generate articles via excel sheet step
    return moveToStep({
      step: Steps.ExcelArticleForm,
      any: {}, // Provide an appropriate value for 'any' as needed
      generationOptions: generationOptions,
    });
  };

  return (
    <>
  {/* Step Indicator removed as requested */}
      {/* Card Container */}
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8">
        <p className="text-body paragraph text-neutral-500 inter-light mb-6">This form creates SEO friendly web content for magazine articles. Select options for Large Language Model to proceed.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label className="block text-heading-2 font-heading-2 mb-2">Grok Version</label>
            <select
              {...register('contentLLMVersion')}
              defaultValue={initialConfig.contentLLMVersion}
              className="w-full px-4 py-2 border border-neutral-200 rounded-md bg-neutral-100 text-neutral-400 cursor-not-allowed focus:outline-none"
              disabled
            >
              <option value="" disabled>
                Grok Version
              </option>
              {contentLLMVersionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-heading-2 font-heading-2 mb-2">Article Amount</label>
            <select
              {...register('generationOptions')}
              defaultValue={GenerationOptionValues.viaUI}
              className={`w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-400 ${errors.generationOptions ? 'border-error-500' : ''}`}
            >
              <option value="" disabled>
                Article Generation Options
              </option>
              {ArticleGenerationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={!isValid}
              className={`cursor-pointer px-6 py-2 rounded-4xl text-md text-white font-semibold shadow duration-200 ${isValid ? 'bg-sky-900 hover:bg-sky-700' : 'bg-neutral-300'}`}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FormStep;
