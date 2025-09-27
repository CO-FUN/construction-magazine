import { yupResolver } from '@hookform/resolvers/yup';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';


import { CommonFormLayout } from '../components/CommonFormLayout';
import { LanguageOptions, SupportedLanguageValues } from '../utils/constants';
import {
  inputDataDESingleArticleSchema,
  inputDataITSingleArticleSchema,
} from '../utils/validation';
import { StepsContext } from './StepsContext';
import { InputDataDE, InputDataIT, Steps } from './types';

const MIN_HEADINGS = 3;
const MIN_FAQS = 3;
const MIN_CONTENT_SIZE = 100;

const SingleArticleFormStep = ({ initialConfig }: { initialConfig: { contentLLMVersion: string } }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<any>({
    values: {
      ...initialConfig,
      articleName: '',
      keywords: '',
      numberOfFaq: MIN_FAQS,
      numberOfHeadings: MIN_HEADINGS,
      minimumNumberOfWords: MIN_CONTENT_SIZE,
      language: 'it',
    },
    mode: 'onChange',
    resolver: yupResolver(
      yup.object().shape({}).oneOf([
        inputDataITSingleArticleSchema.required(),
        inputDataDESingleArticleSchema.required(),
      ])
    ),
  });

  const watchedLanguage = watch('language');

  const { moveToStep } = useContext(StepsContext);

  const onSubmit = async (data: any) => {
    moveToStep({
      step: Steps.Generating,
      data: [data],
      any: {}, // Add the required 'any' property (use appropriate value if needed)
    });
  };

  return (
  <div className="flex flex-col items-center justify-center bg-neutral-50 py-8 px-4 overflow-auto min-h-screen">
      <CommonFormLayout
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="text-lg font-semibold text-gray-800">Article details</div>
        <div className="space-y-6 my-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Article Name</label>
          <input
            {...register('articleName')}
            placeholder="Article Name"
            className={`w-full px-3 py-2 border rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.articleName ? 'border-red-500' : 'border-gray-300'}`}
          />
          <div className="text-sm text-gray-600 mt-2">
            {
              {
                it: "Example: 'Norme di ristrutturazione appartamenti a Trento'",
                de: "Example: 'Wohnungsrenovierungsstandards in Trient'",
              }[watchedLanguage]
            }
          </div>
        </div>
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
                it: "Esempio: 'deposito, lavori, perdita d'acqua, danni causati dall'acqua'",
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
            <option value="" disabled>
              Language
            </option>
            {LanguageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="text-lg font-semibold text-gray-800">Additional configuration</div>
      {watchedLanguage === SupportedLanguageValues.DE && (
        <div className="space-y-6 my-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
            <input
              {...register('instructions')}
              placeholder="Instructions"
              className={`w-full px-3 py-2 border rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${'instructions' in errors && errors.instructions ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Group</label>
            <input
              {...register('targetGroup')}
              placeholder="Target Group"
              className={`w-full px-3 py-2 border rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${'targetGroup' in errors && errors.targetGroup ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
        </div>
      )}
      {watchedLanguage === SupportedLanguageValues.IT && (
        <div className="space-y-6 my-8">
          <div className="flex flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of headings and subheadings</label>
              <input
                type="number"
                {...register('numberOfHeadings')}
                placeholder="Number of headings and subheadings"
                className={`w-full px-3 py-2 border rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${'numberOfHeadings' in errors && errors.numberOfHeadings ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Min. number of words in section</label>
              <input
                type="number"
                {...register('minimumNumberOfWords')}
                placeholder="Min. number of words in section"
                className={`w-full px-3 py-2 border rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${'minimumNumberOfWords' in errors && errors.minimumNumberOfWords ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of FAQs</label>
            <input
              type="number"
              {...register('numberOfFaq')}
              placeholder="Number of FAQs"
              className={`w-full px-3 py-2 border rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${'numberOfFaq' in errors && errors.numberOfFaq ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (optional)</label>
            <input
              {...register('tags')}
              placeholder="tags (optional)"
              className="w-full px-3 py-2 border rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            />
          </div>
        </div>
      )}
      <div className="flex justify-end mt-8">
        <button
          type="submit"
          disabled={!isValid}
          className={`cursor-pointer px-6 py-2 rounded-4xl text-md text-white font-semibold shadow duration-200 ${isValid ? 'bg-sky-900 hover:bg-sky-700' : 'bg-neutral-300'}`}
        >
          Generate content
        </button>
      </div>
    </CommonFormLayout>
    </div>
  );
};

export default SingleArticleFormStep;
