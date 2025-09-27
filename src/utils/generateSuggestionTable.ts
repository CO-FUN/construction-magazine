import { InputDataDE, InputDataIT } from '../steps/types';
import { callOpenAI } from './functions';
import { getSuggestionTableIT } from './messages';

export const generateSuggestionTable = async (
  keywords: string,
  siteMap: string[],
  progressUpdate: (message: string, status: 'info' | 'success') => void
): Promise<
  | InputDataIT[]
  | InputDataDE[] //for future the prompt can be updated based on the language chosen
  | [InputDataIT | InputDataDE]
> => {
  // Article suggestion table for French
  progressUpdate(`Generating Article Suggestion Table`, 'info');
  const suggestionTableFRPrompt = getSuggestionTableIT({ keywords, siteMap });
  const suggestionTableResponse = await callOpenAI(
    suggestionTableFRPrompt,
    'grok-3-mini'
  );
  progressUpdate(`Generating Article Suggestion Table`, 'success');
  return JSON.parse(suggestionTableResponse.result);
};
