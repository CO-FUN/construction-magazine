import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.NEXT_PUBLIC_XAI_API_KEY || "",
});

export interface GrokChatRequest {
  messages: Array<{ role: 'system' | 'user' | 'assistant' | 'function'; content: string; name: string }>; // Updated `role` to use specific string literal types
  model?: string;
}

export interface GrokChatResponse {
  id: string;
  object: string;
  created: number;
  choices: Array<{ message: { role: string; content: string } }>;
  completion?: string | null; // Adjusted type to handle `null` values
}

export const grokCompletionsRequest = async (
  body: GrokChatRequest
): Promise<GrokChatResponse> => {
  const completion = await client.chat.completions.create({
    model: body.model || "grok-3-mini",
    messages: body.messages,
    temperature: 0,
  });

  return {
    id: completion.id,
    object: completion.object,
    created: completion.created,
    // @ts-expect-error
    choices: completion.choices.map((choice: { message: { role: string; content: string } }) => ({
      message: choice.message,
    })),
    completion: completion.choices[0]?.message.content, // Assuming you want to set the completion property here
  };
};

export const completionsRequest = async (
  body: GrokChatRequest
): Promise<GrokChatResponse> => {
  return grokCompletionsRequest(body);
};
