import { OutlineData } from './interfaces';
import { completionsRequest } from './openAIRequests';

//function call to generate article outline
const article_outline = {
  name: 'article_outline_info',
  description: 'Extract the article json from the json body provided',
  parameters: {
    type: 'object',
    properties: {
      H1: {
        type: 'string',
        description: 'get H1 text',
      },
      content: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            Title: {
              type: 'string',
              description: 'H2 title',
            },
            H3: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: 'H3 title',
                  },
                },
              },
              description: 'Array of H3 titles and descriptions',
            },
          },
        },
        description:
          'Array of H2 titles and corresponding H3 titles and descriptions',
      },
      faq: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            Question: {
              type: 'string',
              description: 'get question from faq section',
            },
            Answer: {
              type: 'string',
              description: 'get answer from faq section',
            },
          },
        },
        description: 'get faq section',
      },
      SEOTitle: {
        type: 'string',
        description: 'get seo title text',
      },
    },
  },
};

// TODO: Function calls https://docs.x.ai/docs/guides/function-calling
export async function callOpenAI(messages: any, model = 'grok-3-mini'): Promise<{
  result: string;
  completion: any;
}> {
  try {
    const jsonOutline = await completionsRequest({
      messages: messages,
      model: 'grok-3-mini',
    });

    const content = jsonOutline.choices[0].message.content;
    if (!content) {
      throw new Error('GrokAI response content is null');
    }

    // Clean and validate the content
    const cleanedContent = content.includes('```json')
      ? content.replace(/```json|```$/g, '')
      : content;

    // Remove comments from JSON
    const contentWithoutComments = cleanedContent.replace(/\/\/.*$/gm, '');

    try {
      const outline_article_json = JSON.parse(contentWithoutComments);
      return {
        result: outline_article_json,
        completion: jsonOutline,
      };
    } catch (parseError) {
      console.error('Invalid JSON format in GrokAI response:', contentWithoutComments, parseError);
      throw new Error('Invalid JSON format received from GrokAI');
    }
  } catch (error: any) {
    console.error(error);
    const errorResponse = error?.message || null;
    throw new Error(
      `An error occurred while generating Outline OpenAI. ${
        errorResponse ? JSON.stringify(errorResponse) : ''
      }`
    );
  }
}
