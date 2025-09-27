import { yupResolver } from '@hookform/resolvers/yup';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { CommonFormLayout } from '../components/CommonFormLayout';
import ProgressAlerts from '../components/ProgressAlerts';
import { LanguageOptions, SupportedLanguageValues } from '../utils/constants';
import { generateSuggestionTable } from '../utils/generateSuggestionTable';
import { useProgressMessages } from '../utils/useProgressUpdate';
import {
  inputDataDESuggestionTableSchema,
  inputDataITSuggestionTableSchema,
} from '../utils/validation';
import { StepsContext } from './StepsContext';
import { Steps } from './types';

const SuggestionTableStep = ({ config }: { config: any }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<any>({
    values: {
      ...config,
      keywords: '',
      language: 'it',
    },
    mode: 'onChange',
    resolver: yupResolver(
      yup.object().shape({}).oneOf([
        inputDataITSuggestionTableSchema.required(),
        inputDataDESuggestionTableSchema.required(),
      ])
    ),
  });

  const watchedLanguage = watch('language');
  const { moveToStep } = useContext(StepsContext);
  const { progressUpdate, progressMessages } = useProgressMessages();

  const onSubmit = async ({ keywords }: { keywords: string }) => {
    try {
      const siteMapUrlResponse = await fetch('/api/siteMapApi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({keywords}),
      });
      const siteMapUrls = await siteMapUrlResponse.json();
      const articleSuggestionTableData = await generateSuggestionTable(
        keywords,
        siteMapUrls,
        progressUpdate
      );
      //Now pass the suggestion table data further down to normal generating flow of the content
      moveToStep({
        step: Steps.Generating,
        data: articleSuggestionTableData,
        any: {}, // Add the required 'any' property (use appropriate value if needed)
      });
    } catch (error) {
      console.error(error);
    }
  };

  /* //Loading Monk */
  if (progressMessages.length > 0) {
    return <ProgressAlerts progressMessages={progressMessages} />;
  }

  return (
    <CommonFormLayout
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-6 my-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
          <input
            {...register('keywords')}
            placeholder="Keywords"
            className={`w-full px-3 py-2 border rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.keywords ? 'border-red-500' : 'border-gray-300'}`}
          />
          <div className="text-sm text-gray-600 mt-2">
            {
              {
                de: "Example: 'Kaution, Arbeiten, Wasserleck, Wasserschaden'",
                it: "Example: 'deposito, lavoro, perdita d'acqua, danni causati dall'acqua'",
              }[watchedLanguage]
            }
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            {...register('language')}
            defaultValue={SupportedLanguageValues.IT}
            className={`w-full px-3 py-2 border rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.language ? 'border-red-500' : 'border-gray-300'}`}
          >
            {LanguageOptions.map((option) => (
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
            className={`px-6 py-2 text-white rounded-xl text-lg font-semibold shadow transition-colors duration-200 ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Generate Content
          </button>
        </div>
      </div>
    </CommonFormLayout>
  );
};

export default SuggestionTableStep;
