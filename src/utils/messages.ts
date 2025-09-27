//messages for API
import { InputDataDE, InputDataIT, SupportedLanguages } from '../steps/types';
import { SupportedLanguageValues } from './constants';
import { callOpenAI } from './functions';
import { ContentItem, FAQItem, OutlineData } from './interfaces';
import { extractKeywords } from './validation';

const languageMap = { de: 'German', it: 'Italian', en: 'English' };

// OUTLINE MESSAGE MAIN
export const getOutlineMessages = async (data: InputDataDE | InputDataIT) => {
  const { articleName, keywords } = data;
  const commonParams = {
    articleName: `${articleName}`,
    keywords: extractKeywords(`${keywords}`),
  };

  //IT
  if (data.language === SupportedLanguageValues.IT) {
    return outlineAPImessageIT({
      ...commonParams,
      headings: data.numberOfHeadings,
      faqs: data.numberOfFaq,
    });
  }
  //DE
  if (data.language === SupportedLanguageValues.DE) {
    //first generate the OUTLINE TABLE as in Katrin's Original Prompts
    const outlineTableStructure = await callOpenAI(
      outlineTableMessageDE({
        ...commonParams,
        targetGroup: data.targetGroup,
        instructions: extractKeywords(`${data.instructions}`),
      }),
      'grok-3-mini'
    );
    //then use the result as `message` to the Grok `tools` to generate JSON outline to be passed down further
    return outlineAPImessageDE(outlineTableStructure.result);
  }
};

//IT outline API message
export const outlineAPImessageIT = (options: {
  articleName: string;
  keywords: string[];
  headings: number;
  faqs: number;
}) => {
  const message = [
    {
      role: 'system',
      content: 'You will help me to generate article json',
    },
    {
      role: 'user',
      content: `Must Develop a comprehensive "Outline" structure in ${
        languageMap[SupportedLanguageValues.IT]
      } for a long-form article for ”${
        options.articleName
      }” using as well the keywords ${options.keywords
        .map((key) => `”${key}”`)
        .join(', ')} featuring at least ${
        options.headings
      } engaging headings and subheadings that are detailed, mutually exclusive, collectively exhaustive, and cover the entire topic. Must produce at least ${
        options.faqs
      } FAQs. Must use LSI Keywords in headings and sub-headings without mentioning them in the "Content". Must show the structure in a json for Hn, for headings or subheadings, for the recommended keywords to use to optimize SEO performance. You must indicate the Hn structure (H1,H2, H3,H4,H5,H6, paragraph, etc..)

MUST FOLLOW THESE INSTRUCTIONS IN THE STRUCTURE:
1. Make sure you produce 1 SEO title that is less than 65 characters and that are using the Focus Keyword in the SEO Title.
2. Make sure you produce 1 meta description options with a maximum of 160 characters that is using the Focus Keyword in the meta description
3. Must use The Focus Keyword in the subheading(s).
4. Must use a positive or a negative sentiment word in the Title.
5. Must use a Power Keyword in the Title.
6. Must include the FAQ questions at the end of the structure
7. FAQ has no Hn structure
8. Make sure you produce only one H1 and that should be the title
9. Make sure only ${languageMap[SupportedLanguageValues.IT]} is there
10. Make sure you follow Hn structure
11. The response must include the following fields with their respective schemas:
{
  "seo_title": "string", // SEO title for the article
  "meta_description": "string", // Meta description for the article
  "h1": "string", // The main title of the article
  "structure": [
    {
      "type": "heading2", // or "heading3", "paragraph", etc.
      "text": "Text content for the heading or paragraph",
      "spans": []
    },
    // Additional objects for other headings or paragraphs
  ],
  "content": [
    {
      "type": "paragraph", // or "heading2", "heading3", etc.
      "text": "Text content for the paragraph or heading",
      "spans": []
    }
  ],
  "faqs": [
    {
      "question": "string", // FAQ question
      "answer": "string" // FAQ answer
    }
  ],
  "recommended_keywords": ["string"], // List of recommended keywords
  "completion": {
    "id": "string", // Unique identifier for the completion
    "object": "string", // Object type
    "created": "number", // Timestamp of creation
    "usage": {
      "completion_tokens": "number", // Tokens used for completion
      "prompt_tokens": "number" // Tokens used for the prompt
    }
  }
}
DO NOT COMMENT WHAT YOU DO, ONLY GENERATE JSON,
Now Execute`,
    },
  ];
  return message;
};

//content API message IT
export const contentAPImessageIT = (
  content: ContentItem,
  options: {
    minWords: number;
  }
): any => {
  return [
    {
      role: 'user',
      content: `
      DEVELOP hn section for ${JSON.stringify(content)} by ${
        options.minWords
      } words.
      PLEASE add EMOJI in RELEVANT sections 
      GENERATE JSON object with the following structure:
      
      "content":[
        // skip if it's "FAQ"
        {
          "type": "heading2", // Add "heading2" if it's H2 object, add "heading3" if it's H3 object.
            "text": "use text from heading",
            "spans": []
        },
        // skip if it's "FAQ"
        {
          "type": "paragraph",
            "text": "You will generate the content for this based on Hn by at least ${
              options.minWords
            } words",
            "spans": []
        },
      ]

FOLLOW THESE INSTRUCTIONS:
1. Act as an SEO expert, keep writing in a friendly, optimistic and a witty tone with a touch of humor. 
2. Use an informative style. Use one emoji at least. Try to use the keywords recommended for each section. Write as a human so the content passes AI generated content tests. Provide relevant "heading type" and content for it in "paragraph" type section.
USE only ${languageMap[SupportedLanguageValues.IT].toUpperCase()}
`,
    },
  ];
};
//IT Data Enricher
export const enricherITArticleContent = (
  articleName: string,
  articleContent: string
): any => {
  return [
    {
      role: 'user',
      content: `
      You are passionate about the topic of "${articleName}". 
      Here is the original text about the topic : "${articleContent}"

      1- You connect on the internet on trustworthy italian websites in Italy to memorize statistics and very insightful information and data about this topic
      2- You enrich the original text I gave you by adding statistics, information, recent news and data you memorized inside the text in order to enrich it in a way that it becomes captivating, entertaining and insightful for a reader. 
      
      YOU MUST ONLY INCREASE THE NUMBER OF WORDS OF THE ORIGINAL TEXT, YOU MUST NEVER WRITE LESS WORDS.
      
      IN ANY CASE : 
      You Must not lie. You must not make up information
      You must NOT use interjections like "Ah", "Eh", "Oh", "Beh", "Uhm"
      Do not duplicate the headings from the original title
              
      PLEASE add EMOJI in RELEVANT sections
      After generating the content separate paragraphs into multiple paragraphs where it makes sense
      GENERATE JSON object with the following structure:
      
      "content":[
        // skip if it's "FAQ"
        {
          "type": "heading2", // Add "heading2" if it's H2 object, add "heading3" if it's H3 object.
          "text": "use text from heading",
          "spans": []
        },
        // skip if it's "FAQ"
        {
          "type": "paragraph",
            "text": "You will generate the content for this based on Hn",
            "spans": []
        },
      ]
      Execute now and produce JSON,
`,
    },
  ];
};

//IT content about Construction
export const aboutITConstructionAPImessage = (
  articleName: string
): any => {
  return [
    {
      role: 'user',
      content: `
      I will ask you to operate steps action : 
      1. I will feed you with information about company. You will memorize it. 
      2. I will Feed you a topic:"${articleName}" of a text.
      3.You will generate a 50 words paragraph in ${languageMap[
        SupportedLanguageValues.IT
      ].toUpperCase()} that could easily be inserted in the end of the text featuring companies information. You will pick and choose the information you use in a way that it looks relevant to the topic:"${articleName}" of the text AND not misleading. OR adds to info aside of the topic:"${articleName}" of the text, if more accurate. You must NEVER say something inaccurate or misleading or lie.You must NEVER say something that you are not certain about. You MUST CLARIFY that company is doing a construction.
        
      "content":[
        {
          "type": "heading2", // Add "heading2" if it's "Title" object
          "text": "use text from heading",
          "spans": []
        },
        {
          "type": "paragraph",
            "text": "You will generate the content for this",
            "spans": []
        },
      ]
Execute now and produce JSON,
`,
    },
  ];
};

//German OutlineAPIMessage
export const outlineTableMessageDE = (options: {
  articleName: string;
  keywords: string[];
  targetGroup: string;
  instructions: string[];
}): any => {
  return [
    {
      role: 'user',
      content: `Your task is to generate a comprehensive "Outline" structure in German for a long-form article "${
        options.articleName
      }“ This is the target group that the article is intended to address: "${
        options.targetGroup
      }".
      ”${options.instructions.map((key) => `”${key}”`).join(', ')}”
      Please create a structure for an article that is detailed, mutually exclusive, collectively exhaustive and includes the following keywords: "${options.keywords
        .map((key) => `”${key}”`)
        .join(', ')}". 
      Please provide at least 5 FAQs. Use the mentioned keywords in headings and sub-headings. Show the structure in a table with 1 column for Hn and 1 column for headings or subheadings. You must indicate the Hn structure (H2, H3, paragraph, etc..) Include the FAQs at the end of the structure. They don’t have a Hn structure. The introduction (Einführung) is placed directly under the H1 and does not need a separate subheading. Don’t explain what you do.`,
    },
  ];
};
export const outlineAPImessageDE = (outlineTableStructure: string) => {
  return [
    {
      role: 'system',
      content: 'You will be help me to generate article json',
    },
    {
      role: 'user',
      content: `${outlineTableStructure}`,
    },
  ];
};

//Intro message DE
export const introAPIMessage = (
  outlineData: ContentItem[],
  title: string
): any => {
  //Providing Grok clear instructions about outline table to know about the article context.
  //Extracted intro part prompt from Katrin's original prompt
  //Splitting intro part helps so it doesnt provide intro for each headline but providing one intro based on the title that got generated from outline structure.
  return [
    {
      role: 'user',
      content: `
      MEMORIZE ${JSON.stringify(
        outlineData
      )} to know about ARTICLE CONTEXT and then WRITE the "Einführung" in JSON for topic:${JSON.stringify(
        title
      )}-short introduction (2 short or 1 longer paragraph, without bullet points or listings), you start with a suitable situation or example that illustrates why the topic:${JSON.stringify(
        title
      )} is important for the reader.${JSON.stringify(
        targetMessage(SupportedLanguageValues.DE)
      )}

        GENERATE JSON object with the following structure:
  
        "content":[
          {
            "type": "paragraph",
              "text": "You will generate the content for this based on title",
              "spans": []
          },
        ]
        USE only ${languageMap[
          SupportedLanguageValues.DE
        ].toUpperCase()} ,DO NOT COMMENT WHAT YOU DO
  `,
    },
  ];
};

//content API message DE
export const contentAPImessageDE = (
  currentTopic: ContentItem,
  previousTopic: ContentItem | undefined,
  outlineData: ContentItem[],
  index: number
): any => {
  //Providing Grok clear instructions about outline table to know about the article context.
  //currentTopic and previousTopic to know about the context about what is happening and to bring the connection within different sections of the article, so it knows the starting point and where to go along
  //if its first index then it doesnt have previous Topic and it can be started fresh knowing only the outline table.
  //Tone and style from katrin original prompt
  const prevMessage =
    index !== 0
      ? `Now that you have generated for "${JSON.stringify(previousTopic)}"`
      : '';

  return [
    {
      role: 'user',
      content: `
      MEMORIZE ${JSON.stringify(
        outlineData
      )} to know about ARTICLE CONTEXT, ${JSON.stringify(prevMessage)}
      DEVELOP hn section for ${JSON.stringify(currentTopic)}
       in JSON by "2000" words. For each heading you write at least one paragraph, also for H2s. Enrich the text with ordered and unordered lists.
       Tone and Style: The article should maintain a professional yet approachable tone. It should provide clear, concise information with an emphasis on practical advice. Humor and wit should be used sparingly and appropriately to maintain the article's informative nature.${JSON.stringify(
         targetMessage(SupportedLanguageValues.DE)
       )}
       Write as a human so the content passes AI generated content tests.  For each response you will focus on a section. If a section contains subsections, you will expand each subsection in a seperate response. 
   
        GENERATE JSON object with the following structure:
  
        "content":[
          // skip if it's "FAQ", skip if its under "H3"
          {
            "type": "heading2", // Add "heading2" if it's "Title" object
              "text": "use text from heading",
              "spans": []
          },
          {
            "type": "paragraph", // Add "heading2" if it's "Title" object
              "text": "You will WRITE the CONTENT based on "Title" object",
              "spans": []
          },
          
          // skip if it's "FAQ"
          {
            "type": "heading3", // Add "heading3" if it's "H3" object
              "text": "use text from heading",
              "spans": []
          },
          // skip if it's "FAQ"
          {
            "type": "paragraph",
              "text": "You will generate the content for this based on Hn",
              "spans": []
          },
        ]
        USE only ${languageMap[
          SupportedLanguageValues.DE
        ].toUpperCase()} ,DO NOT COMMENT WHAT YOU DO
  `,
    },
  ];
};

//FAQ Message
export const faqMessage = (
  faqData: FAQItem[],
  language: SupportedLanguages
): any => {
  return [
    {
      role: 'user',
      content: `use the ${JSON.stringify(
        faqData
      )} generated from first prompt to Develop the FAQ section. Act as an SEO expert, keep writing in a friendly, optimistic and a witty tone with a touch of humor. Use informative style. ${emojiMessage(
        language
      )} Try to use the keywords recommended. Write as a human so the content passes AI generated content tests. 
      ${JSON.stringify(targetMessage(language))}
TAKE below json as output shape

Generate JSON object with the following structure only for FAQ:
{"body": [
  {
    primary: {
      richtext_ref: 'faq',
      kicker: [],
      heading: [],
      hide_faq_structured: false,
    },
    items: [
      {
        question: "",
        answer: [
          {
            type: 'paragraph',
            text: "You will generate the content for this from FAQ", 
            spans: [],
          },
        ],
      },
    ],
    slice_type: 'faq',
    slice_label: null,
  },
]}
Execute now and produce JSON,
USE only ${languageMap[language].toUpperCase()}
CONTINUE EXECUTING for each FAQ object until you reach end
`,
    },
  ];
};

//emoji message only for IT
const emojiMessage = (language: SupportedLanguages) => {
  return `${language}` === SupportedLanguageValues.IT
    ? `Use one emoji at least.`
    : '';
};

// target group only for DE
const targetMessage = (language: SupportedLanguages) => {
  return `${language}` === SupportedLanguageValues.DE
    ? `The reader is addressed directly as „du“.`
    : '';
};

//"uid","page_name","heading","meta_data" messages
export const otherDataMessage = (
  outlineData: OutlineData,
  language: SupportedLanguages
): any => {
  return [
    {
      role: 'user',
      content: `
use the ${JSON.stringify(
        outlineData
      )} generated from first prompt to Develop the below JSON for "uid","page_name","heading","meta_data".
Act as an SEO expert, 
keep writing in a friendly, optimistic and a witty tone with a touch of humor. 
Use informative style. ${emojiMessage(language)}
Try to use the keywords recommended.
  Write as a human so the content passes AI generated content tests. 
TAKE below json as output shape

Generate JSON object with the following structure:
{
  "uid": "GENERATE relevant uid based on H1",
  "page_name": "GENERATE based on H1",
  "heading": [
    {
      "type": "heading1",
      "text": "GENERATE based on H1",
      "spans": []
    }
  ],
  "meta_data": [
    {
      "title": "GENERATE from H1 in outlineData",
      "description": "Generate from Meta Description",
      "robots_index": "index",
      "robots_follow": "follow"
    }
  ]
}
Execute now and produce JSON only for "uid","page_name","heading","meta_data"
USE only ${languageMap[language].toUpperCase()}
`,
    },
  ];
};

// IT
export const getSuggestionTableIT = (options: {
  keywords: string;
  siteMap: string[];
}): any => {
  return [
    {
      role: 'user',
      content: `You are an SEO expert. You specialize in keyword research and titles for SEO articles in italian, specifically for the construction industry.
      You create "suggestion tables" in italian.
      The suggestion tables are SEO content proposals in table form with a column for the "articleName", a column for the secondary keywords you recommend separated by commas in column name "keywords", a column with the word "it", a column for the number of headers or subheaders you recommend in column name "numberOfHeadings", a column for the number of FAQs you recommend in column name "numberOfFaq", and a column for the minimum number of words you recommend per paragraph in column name "minimumNumberOfWords".
      
      Here is an example (for demonstration purposes only, do not copy — generate new Italian construction-related content):
      [ristrutturazione casa Ristrutturazione edilizia, costi, incentivi, bonus edilizi it 5 5 150
      Come pianificare la ristrutturazione di una casa Ristrutturazione, permessi, progettazione, imprese edili it 6 4 120
      Bonus edilizi 2025: come funzionano e come richiederli bonus casa, agevolazioni fiscali, detrazioni it 4 5 150
      Costruire una casa nuova: fasi e costi costruzione, materiali, architettura, preventivi it 5 4 120
      Sicurezza nei cantieri edili: normative e obblighi sicurezza lavoro, dispositivi, regole cantieri it 6 3 100]

      INSTRUCTIONS:
      1. Your answer includes the requested content word in **bold** in the table, and you must associate secondary keywords, language, number of headers, number of FAQs, and minimum words per paragraph, followed by the suggestions you propose. Then, you continue with the next requested content word in **bold**, followed by your suggestions, and so on, exactly as in the example.
      2. Your response MUST take the form of a javascript array.

      Generate ARRAY object with the following structure::
      [{
        "articleName": take from column article title you generated,
        "keywords": " take from column you generated",
        "numberOfFaq": take from column numberOfFaq you generated,
        "numberOfHeadings": take from column numberOfHeadings you generated,
        "minimumNumberOfWords": take from column minimumNumberOfWords you generated,
        "language": "it", default value
      }]
      
      START INSTRUCTIONS:
      You determine the number of content suggestions for each requested word so that each suggestion covers a different dimension or aspect, ensuring all suggested content is mutually exclusive.
      Do you understand? If yes, start with these words: 
      [${options.keywords
        .split(',')
        .map((key) => `“${key.trim()}”`)
        .join(', ')}]
    
      IMPORTANT : 
      YOU CANNOT GIVE SUGGESTIONS THAT WOULD BE A DUPLICATE OF ONE OF THE PAGES EXISTING ON THIS SITEMAP + send live XML sitemap :${
        options.siteMap && options.siteMap.map((key) => `”${key}”`).join(', ')
      }
      YOU DO NOT EXPLAIN ANYTHING ELSE BUT ONLY ARRAY RESULT`,
    },
  ];
};