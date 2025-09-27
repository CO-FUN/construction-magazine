// Extracted from https://openai.com/pricing
const costsMapper: Partial<
  Record<
    any,
    { input: number; output: number }
  >
> = {
  'grok-3-mini': {
    input: 0.3 / 1000000,
    output: 0.5 / 1000000,
  },
};

export const extractCompletionCosts = (
  completion: any
) => {
  if (!completion || !completion.usage) {
    console.error('Invalid completion object:', completion);
    return 0; // Default to 0 cost if completion is invalid
  }

  const mapper = costsMapper[completion.model];
  if (!mapper) {
    console.error('Model not found in costsMapper:', completion.model);
    return 0; // Default to 0 cost if model is not found
  }

  const { input, output } = mapper;
  const { completion_tokens, prompt_tokens } = completion.usage;
  return prompt_tokens * input + completion_tokens * output;
};
