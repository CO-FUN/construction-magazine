import { completionsRequest } from './openAIRequests';

// TODO: Function calls https://docs.x.ai/docs/guides/function-calling
export async function callOpenAI(messages: any, model = 'grok-3-mini'): Promise<{
  result: string;
  completion: any;
}> {
  try {
    const jsonOutline = await completionsRequest({
      messages: messages,
      model,
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
