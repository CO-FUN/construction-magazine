import {
  ArticleResult,
  Content,
  InputDataDE,
  InputDataIT,
  RejectedResult,
  SupportedLanguages,
} from '../steps/types';
import { SupportedLanguageValues, articlesJson } from './constants';
import { extractCompletionCosts } from './costs';
import { callOpenAI } from './functions';
import { ContentItem, FAQItem, OutlineData } from './interfaces';
import {
  contentAPImessageDE,
  contentAPImessageIT,
  enricherITArticleContent,
  faqMessage,
  getOutlineMessages,
  introAPIMessage,
  otherDataMessage,
} from './messages';

const validatedData = (data: any) => {
  try {
    if (typeof data === 'string') {
      const cleanedData = data.includes('```json') ? data.replace(/```json|```$/g, '') : data;
      return JSON.parse(cleanedData); // Parse JSON string
    } else if (typeof data === 'object' && data !== null) {
      // If data is already an object or array, return it as-is
      return data;
    } else {
      throw new Error(`Expected a string or object, but received: ${typeof data}`);
    }
  } catch (error) {
  throw new Error('Invalid JSON format or data type received from API');
  }
};

export const generateContent = async (
  excelValues: InputDataIT[] | InputDataDE[] | [InputDataIT | InputDataDE],
  commonConfig: any,
  progressUpdate: (message: string, status: 'info' | 'success') => void,
  costsUpdate: (value: number) => void
) => {
  const { contentLLMVersion } = commonConfig;

  const start = Date.now();

  //cost calculation
  let cost = 0;
  const innerCostUpdate = (
    completion: any
  ) => {
    cost += extractCompletionCosts(completion);
    costsUpdate(cost);
  };

  //FAQ section
  const faqSection = async (
    faqItems: FAQItem[],
    language: SupportedLanguages,
    index: number
  ) => {
    try {
      const faqData = await callOpenAI(
        faqMessage(faqItems, language),
        contentLLMVersion
      );
      progressUpdate(`Generating FAQ for article: ${index + 1}`, 'success'); //update success status

      // Validate and parse the content field from the response
      const parsedContent = validatedData(faqData.result);
      if (!parsedContent.body || !Array.isArray(parsedContent.body)) {
        throw new Error('Invalid FAQ response: Missing or invalid body field');
      }

      innerCostUpdate(faqData.completion); // calculate costs
      return parsedContent; // Return the parsed content
    } catch (error) {
      console.error('An error occurred during FAQ generation:', error);
      throw error;
    }
  };

  //other data section
  const otherDataSection = async (
    outlineData: OutlineData,
    language: SupportedLanguages,
    index: number
  ) => {
    try {
      const otherData = await callOpenAI(
        otherDataMessage(outlineData, language),
        contentLLMVersion
      );
      progressUpdate(
        `Generate title, page name and meta description - for article: ${
          index + 1
        }`,
        'success'
      );
      innerCostUpdate(otherData.completion); // calculate costs

      // Ensure result is treated as an object
      let parsedResult;
      if (typeof otherData.result === 'string') {
        parsedResult = JSON.parse(otherData.result);
      } else if (typeof otherData.result === 'object') {
        parsedResult = otherData.result;
      } else {
        throw new Error('Invalid otherData response: Missing or invalid result field');
      }

      return parsedResult; // Return the parsed result
    } catch (error) {
      console.error('An error occurred during generation:', error);
      throw error;
    }
  };

  // Function to expand content for each heading or subsection
  const expandContent = async (
    outlineData: ContentItem[],
    language: SupportedLanguages,
    minContentSize: number,
    index: number,
    title: string
  ) => {
    try {
      const contentSections = await Promise.allSettled([
        //Intro content only for DE
        ...(language === SupportedLanguageValues.DE
          ? [callOpenAI(introAPIMessage(outlineData, title), contentLLMVersion)]
          : []),
        ...outlineData.map(async (currentTopic, currentTopicIndex, array) => {
          //Content for IT
          if (language === SupportedLanguageValues.IT) {
            const contentIT = await callOpenAI(
              contentAPImessageIT(currentTopic, {
                minWords: minContentSize,
              }),
              contentLLMVersion
            );
            
            debugger
            return callOpenAI(
              enricherITArticleContent(title, JSON.stringify(contentIT.result)),
              contentLLMVersion
            );
          }
          //Content for DE
          if (language === SupportedLanguageValues.DE) {
            const previousTopic =
              currentTopicIndex > 0 ? array[currentTopicIndex - 1] : undefined;
            return callOpenAI(
              contentAPImessageDE(
                currentTopic,
                previousTopic,
                array,
                currentTopicIndex
              ),
              contentLLMVersion
            );
          }
        }),
      ]);
      // Update cost for each completion
      const parsedContentItems: Content[] = contentSections
        .filter(
          (
            data
            // @ts-expect-error
          ): data is PromiseFulfilledResult<{
            result: { content: Content[] };
            completion: any;
          }> => data.status === 'fulfilled' && data.value !== undefined && typeof data.value.result === 'object' && 'content' in data.value.result
        )
        .map((contentSection) => {
          // @ts-expect-error
          innerCostUpdate(contentSection.value.completion); // Update cost for each completion
          progressUpdate(
            `Generating content for article: ${index + 1}`,
            'success'
          ); //@ts-expect-error
          return contentSection.value.result.content; // Extract content directly
        })
        .flat(); // Flatten the array of content arrays

      return { content: parsedContentItems.flat() };
    } catch (error) {
      console.error(`Error expanding content for index: ${index}`, error);
      throw error;
    }
  };

  // article OutlineData
  // Promise.allSettled to get outcome of all article OutlineData
  const outlineData = await Promise.allSettled(
    excelValues.map(async (data, index) => {
      const { language } = data;
      try {
        // Step 1: Generate Outline Data
        progressUpdate(
          `Generating outline structure for article: ${index + 1}`,
          'info'
        );
        const messages = await getOutlineMessages(data);
        const outlineAPIResponse = await callOpenAI(messages);
        return {
          outlineAPIResponse,
          language,
          minimumNumberOfWords:
            'minimumNumberOfWords' in data ? data.minimumNumberOfWords : 100,
          tags: 'tags' in data ? data.tags : '',
        };
      } catch (error) {
        return Promise.reject({ index, error });
      }
    })
  );

  const outlineDataResults = outlineData
    .filter(
      (
        result
        // @ts-expect-error
      ): result is PromiseFulfilledResult<{
        outlineAPIResponse: {
          result: OutlineData;
          completion: any;
        };
        language: SupportedLanguages;
        minimumNumberOfWords: number;
        tags: string;
      }> => result.status === 'fulfilled'
    )
    // @ts-expect-error
    .map((result) => result.value);

  // Ensure unique processing of indices
  const processedIndices = new Set<number>();

  // Generate Content
  // Promise.allSettled to get outcome of all articles promises and handle both fulfillments and rejections.
  const generatedContentResults = await Promise.allSettled(
    outlineDataResults.map(
      async (
        outlineDataItem,
        index
      ): Promise<{ mergedData: ArticleResult; index: number }> => {
        if (processedIndices.has(index)) {
          console.warn(`Skipping duplicate processing for index: ${index}`);
          return Promise.reject({ index, error: 'Duplicate processing detected' });
        }
        processedIndices.add(index);

        try {

          innerCostUpdate(outlineDataItem.outlineAPIResponse.completion);
          progressUpdate(
            `Generating outline structure for article: ${index + 1}`,
            'success'
          );
          const outlineResult = outlineDataItem.outlineAPIResponse.result;
          const structure = outlineResult.structure;
          if (!structure) {
            throw new Error('Structure field is missing in the API response');
          }

          const content = outlineResult.content;
          if (!content || !Array.isArray(content)) {
            throw new Error('Content field is missing or invalid in the API response');
          }

          // Validate and process content items
          const processedContent: ContentItem[] = content.map((item: { type: string; text: any }) => {
            if (typeof item.text !== 'string') {
              console.error('Invalid text field in content item:', item);
              throw new Error('Content item text field is not a valid string');
            }
            if (item.type === 'paragraph' || item.type.startsWith('heading')) {
              return { H1: item.text, H2: [], content: [] } as ContentItem;
            }
            return { H1: '', H2: [], content: [] } as ContentItem;
          }).filter((item) => item.H1 !== '');

          const title = outlineResult.h1 || outlineResult.H1;
          if (!title || typeof title !== 'string') {
            throw new Error(`Invalid title value for index ${index}: ${title}`);
          }

          // Step 2: Iterative Expansion
          progressUpdate(
            `Generating content for article: ${index + 1}`,
            'info'
          );
          const contentData = await expandContent(
            processedContent,
            outlineDataItem.language,
            outlineDataItem.minimumNumberOfWords,
            index,
            title
          );

          const faq = outlineResult.faqs || [];

          // Step 3: FAQ
          progressUpdate(`Generating FAQ for article: ${index + 1}`, 'info');
          const parsedFaqData = await faqSection(
            faq,
            outlineDataItem.language,
            index
          );

          // Step 4: Generate H1, Page name, meta data description
          progressUpdate(
            `Generate title, page name and meta description - for article: ${
              index + 1
            }`,
            'info'
          );
          const parsedOtherData = await otherDataSection(
            outlineResult,
            outlineDataItem.language,
            index
          );

          //tags IT
          const tags = outlineDataItem.tags
            ? { tags: outlineDataItem.tags.split(',') }
            : {};

          // Step 5: Final Data Merging
          const mergedData: ArticleResult = {
            ...articlesJson,
            ...contentData,
            ...parsedFaqData,
            ...parsedOtherData,
            ...tags,
            lang: {
              de: 'de-de' as const,
              it: 'it-it' as const,
            }[outlineDataItem.language as SupportedLanguages],
          };
          return { mergedData, index };
        } catch (error) {
          console.error(`Error generating content for index: ${index}`, error);
          return Promise.reject({ index, error });
        }
      }
    )
  );

  // Process the results
  const successfulResults = generatedContentResults
    .filter(
      (
        result
      ): result is PromiseFulfilledResult<{
        mergedData: ArticleResult;
        index: number;
      }> => result.status === 'fulfilled'
    )
    .map((result) => result.value);

  const failedResults = generatedContentResults
    .filter((result): result is RejectedResult => result.status === 'rejected')
    .map((result) => {
      console.error(`Failed result at index: ${result.reason.index}`, result.reason.error);
      return { reason: result.reason };
    });

  // Return the final result
  return {
    successfulResults,
    failedResults,
    cost,
    time: Math.ceil((Date.now() - start) / 1000),
  };
};
