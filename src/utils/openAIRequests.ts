import { GrokChatRequest, GrokChatResponse } from './grokRequests';

export const completionsRequest = async (
  body: GrokChatRequest
): Promise<GrokChatResponse> => {
  const response = await fetch('/api/grokCompletions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch from API route');
  }

  return response.json();
};
