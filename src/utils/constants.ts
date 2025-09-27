import { GenerationOptions, SupportedLanguages } from '../steps/types';

export const articlesJson = {
  header_type: 'full',
  footer_type: 'full',
  header_cta_button: [{}],
  breadcrumb_title: '',
  type: 'magazine_article',
  tags: ['Article', '2025'],
  lang: 'it-it',
};

export const LanguageOptions: { label: string; value: SupportedLanguages }[] = [
  { label: '🇩🇪 German', value: 'de' },
  { label: '🇮🇹 Italian', value: 'it' },
];

export const GenerationOptionValues: {
  [K in GenerationOptions]: GenerationOptions;
} = {
  viaExcel: 'viaExcel',
  viaUI: 'viaUI',
  viaSuggestionTable: 'viaSuggestionTable',
};

export const SupportedLanguageValues = {
  DE: 'de',
  IT: 'it',
} as const;
