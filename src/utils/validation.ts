import * as yup from 'yup';

import { InputDataDE, InputDataIT } from '../steps/types';
import { SupportedLanguageValues } from './constants';

//const
const ARTICLE_NAME_MIN_LENGTH = 5;
const ARTICLE_NAME_MAX_LENGTH = 160;
const KEYWORDS_INPUT_MAX_LENGTH = 300;
const MIN_HEADINGS = 3;
const MAX_HEADINGS = 15;
const MIN_FAQS = 3;
const MAX_FAQS = 10;
const MIN_CONTENT_SIZE = 100;
const MAX_CONTENT_SIZE = 1500;
const MIN_KEYWORDS = 1;
const MAX_KEYWORDS = 20;

export const extractKeywords = (value: string) =>
  value
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

//individual schemas
const transformNumberFields = (originalValue: any) => {
  const parsedValue = Number(originalValue);
  return isNaN(parsedValue) ? undefined : parsedValue;
};

export const articleNameSchema: yup.StringSchema<string> = yup
  .string()
  .required('Please provide article name')
  .min(
    ARTICLE_NAME_MIN_LENGTH,
    `Name should have at least ${ARTICLE_NAME_MIN_LENGTH} characters`
  )
  .max(
    ARTICLE_NAME_MAX_LENGTH,
    `Limited to ${ARTICLE_NAME_MAX_LENGTH} characters`
  );

export const numberOfHeadingsSchema: yup.NumberSchema<number> = yup
  .number()
  .transform(transformNumberFields)
  .required('Please provide number of headings')
  .min(MIN_HEADINGS, ({ min }) => `Headings should have Min. value of ${min}`)
  .max(MAX_HEADINGS, ({ max }) => `Heading limited to ${max} characters`);

export const keywordsSchema: yup.StringSchema<string> = yup
  .string()
  .required('Please provide keywords separated with comma')
  .max(
    KEYWORDS_INPUT_MAX_LENGTH,
    `Limited to ${KEYWORDS_INPUT_MAX_LENGTH} characters`
  )
  .test('minKeywords', `Provide at least ${MIN_KEYWORDS} keywords`, (value) => {
    return extractKeywords(value).length >= MIN_KEYWORDS;
  })
  .test('maxKeywords', `Over ${MAX_KEYWORDS} keywords`, (value) => {
    return extractKeywords(value).length <= MAX_KEYWORDS;
  });

export const instructionsSchema: yup.StringSchema<string> = yup
  .string()
  .required('Please provide instructions');

export const targetGroupSchema: yup.StringSchema<string> = yup
  .string()
  .required('Please provide Target Group');

export const numberOfFaqSchema: yup.NumberSchema<number> = yup
  .number()
  .transform(transformNumberFields)
  .required(`Please provide number of FAQ's`)
  .min(MIN_FAQS, ({ min }) => `FAQ's should be at least ${min}`)
  .max(MAX_FAQS, ({ max }) => `FAQ's limited to ${max} characters`);

export const minimumNumberOfWordsSchema: yup.NumberSchema<number> = yup
  .number()
  .transform(transformNumberFields)
  .required(`Please provide minimum Number of words`)
  .min(MIN_CONTENT_SIZE, ({ min }) => `Content size should be at least ${min}`)
  .max(MAX_CONTENT_SIZE, ({ max }) => `Content size limited to ${max}`);

export const deLanguageSchema: yup.StringSchema<
  typeof SupportedLanguageValues.DE
> = yup
  .string()
  .required(`Required "it or de or en"`)
  .oneOf([SupportedLanguageValues.DE], 'Invalid language. Input "it or en or de"');

export const itLanguageSchema: yup.StringSchema<
  typeof SupportedLanguageValues.IT
> = yup
  .string()
  .required(`Required "it or de or en"`)
  .oneOf([SupportedLanguageValues.IT], 'Invalid language. Input "it or en or de"');

//common Schema
export const commonSchema = yup.object({
  articleName: articleNameSchema,
  keywords: keywordsSchema,
});

// IT Suggestion Table validation Schema
export const inputDataITSuggestionTableSchema = yup.object({
  keywords: keywordsSchema,
  language: itLanguageSchema,
});

// DE Suggestion Table validation Schema TO DO:FOR FUTURE
export const inputDataDESuggestionTableSchema = yup.object({
  language: deLanguageSchema,
  keywords: keywordsSchema,
});

//IT single article validation schema
export const inputDataITSingleArticleSchema = commonSchema.shape({
  numberOfHeadings: numberOfHeadingsSchema,
  numberOfFaq: numberOfFaqSchema,
  minimumNumberOfWords: minimumNumberOfWordsSchema,
  language: itLanguageSchema,
});

//IT excel file validation schema
export const inputDataITSchema = yup.array().of(inputDataITSingleArticleSchema);

//DE Single article validation schema
export const inputDataDESingleArticleSchema = commonSchema.shape({
  instructions: instructionsSchema,
  targetGroup: targetGroupSchema,
  language: deLanguageSchema,
});

//DE excel file Validation Schema
export const inputDataDESchema = yup.array().of(inputDataDESingleArticleSchema);

//validation with yup
//reference https://react-hook-form.com/advanced-usage
export const validationMessages = async (
  transformedData: InputDataIT[] | InputDataDE[]
) => {
  try {
    const schemaToUse = transformedData.some(
      (item) => item.language === SupportedLanguageValues.IT
    )
      ? inputDataITSchema
      : inputDataDESchema;
    const values = await schemaToUse.validate(transformedData, {
      abortEarly: false,
    });

    return {
      values,
      errors: {},
    };
  } catch (errors: any) {
    return {
      values: {},
      errors: errors.inner.reduce(
        (
          allErrors: any,
          currentError: { path: any; type: string; message: string }
        ) => ({
          ...allErrors,
          [currentError.path]: {
            type: currentError.type ?? 'validation',
            message: currentError.message,
            index: currentError.path,
          },
        }),
        {}
      ),
    };
  }
};
