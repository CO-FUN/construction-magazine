interface H3Item {
  title: string;
}

interface H2Item {
  Title: string;
  H3: H3Item[];
}

export interface ContentItem {
  H1: string;
  H2: H2Item[];
}

export interface FAQItem {
  Question: string;
}

export interface CompletionUsage {
  completion_tokens: number;
  prompt_tokens: number;
}

export interface Completion {
  id: string;
  object: string;
  created: number;
  usage: CompletionUsage;
}

export interface OutlineData {
  SEOTitle: string;
  H1: string;
  content: ContentItem[];
  faq: FAQItem[];
  completion?: Completion;
}

export interface OpenAIResponse {
  result: string;
  completion: Completion;
  choices?: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}
