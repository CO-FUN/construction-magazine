import { SupportedLanguageValues } from '../utils/constants';

export enum Steps {
  Form = 'form',
  SingleArticleForm = 'singleArticleForm',
  ExcelArticleForm = 'excelArticleForm',
  Generating = 'generating',
  Success = 'success',
  Error = 'error',
  SuggestionTable = 'suggestionTable',
}

export type SupportedLanguages =
  (typeof SupportedLanguageValues)[keyof typeof SupportedLanguageValues];

export type GenerationOptions = 'viaUI' | 'viaExcel' | 'viaSuggestionTable';

export type ConfigurationForm = {
  language: SupportedLanguages;
  numberOfHeadings: number;
  numberOfFaqs: number;
  minContentSize: number;
};

export type ArticleForm = {
  articleName: string;
  keywords: string;
};

export type SuccessFormState = {
  step: Steps.Success;
  result: {
    cost: number;
    time: number;
    failedResults: Pick<RejectedResult, 'reason'>[];
    successfulResults: any[]; // Added successfulResults to include successful data
  };
};

type GeneratingFormState = {
  step: Steps.Generating;
  data: InputDataIT[] | InputDataDE[] | [InputDataIT | InputDataDE];
  any: any;
};
type SingleArticleFormState = {
  step: Steps.SingleArticleForm;
  any: any;
  generationOptions: GenerationOptions;
};
type SuggestionTableState = {
  step: Steps.SuggestionTable;
  any: any;
};
type ExcelArticleFormState = {
  step: Steps.ExcelArticleForm;
  any: any;
  generationOptions: GenerationOptions;
};
export type ErrorFormState = {
  step: Steps.Error;
  result: {
    failedResults: Pick<RejectedResult, 'reason'>[];
  };
};

export type GenerationStepState =
  | { step: Steps.Form }
  | GeneratingFormState
  | SingleArticleFormState
  | ExcelArticleFormState
  | SuccessFormState
  | ErrorFormState
  | SuggestionTableState;

type ContentText = {
  text: string;
  spans: any[];
};

export type Content = {
  type: 'heading2' | 'heading3' | 'paragraph';
} & ContentText;

export type Anchor = {
  id: string;
  text: string;
};

type FAQAnswerParagraph = {
  type: 'paragraph';
  direction: string;
} & ContentText;

type FAQQuestion = {
  question: string;
  answer: FAQAnswerParagraph[];
};

type FAQSection = {
  repeat: FAQQuestion[];
  nonRepeat: {
    richtext_ref: string;
  };
};

type Heading = {
  type: 'heading1';
} & ContentText;

type BodySection = {
  key: string;
  value: FAQSection | null;
};

type PageMetadata = {
  title: string;
  description: string;
  robots_index: string;
  robots_follow: string;
};

export type ArticleResult = {
  header_type: string;
  footer_type: string;
  header_cta_button: any[];
  breadcrumb_title: string;
  type: 'magazine_article';
  tags: string[];
  lang: 'it-it' | 'de-de';
  content: Content[];
  body: BodySection[];
  uid: string;
  page_name: string;
  heading: Heading[];
  meta_data: PageMetadata[];
  anchors: Anchor[];
};

export type BaseInputData = {
  articleName: string;
  keywords: string;
};

export type InputDataIT = BaseInputData & {
  numberOfHeadings: number;
  numberOfFaq: number;
  minimumNumberOfWords: number;
  language: typeof SupportedLanguageValues.IT;
  tags?: string;
  siteMap?: string[];
};

export type InputDataDE = BaseInputData & {
  instructions: string;
  targetGroup: string;
  language: typeof SupportedLanguageValues.DE;
};

export type InputDataEN = BaseInputData & {
  instructions: string;
  targetGroup: string;
  language: typeof SupportedLanguageValues.IT;
};

export type RejectedResult = PromiseRejectedResult & {
  index: number;
};

export type ProgressMessage = {
  message: string;
  status: 'info' | 'success' | 'error';
};
