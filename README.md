# Construction Website Content Generator

Generate high-quality marketing articles for construction topics using Grok AI—either with a single click or by uploading an Excel file.

## Features

- **Single or Bulk Article Generation**
- **Supports Italian (IT) and German (DE)**
- **Customizable: Headings, Keywords, FAQs, Tags, Minimum Words**
- **Excel Upload for Bulk Generation**
- **Powered by Grok AI Model**

## Architecture Overview

This app is built with **Next.js** (React, TypeScript) and uses **Tailwind CSS** for styling. Content generation is orchestrated via Grok AI API calls, with a modular structure for scalability and maintainability.

### Main Components

- **Frontend (Next.js, React):**
  - User interface for inputting article parameters or uploading Excel files.
  - Progress feedback and cost tracking during generation.
  - Components: `CommonFormLayout`, `WizardStepper`, `ProgressAlerts`, etc.

- **Content Generation Logic (TypeScript):**
  - Located in `src/utils/generateContentUtil.ts`.
  - Handles input validation, orchestrates API calls, merges results, and calculates costs.
  - Integrates with Grok/OpenAI via utility functions in `src/utils/functions.ts` and `src/utils/messages.ts`.

- **API Integration:**
  - Uses Grok (and optionally OpenAI) for generating outlines, expanding content, FAQs, and metadata.
  - API requests are batched and managed with cost tracking.

- **Excel Import:**
  - Bulk mode parses Excel files, maps rows to article generation jobs, and aggregates results.

### Data Flow

1. **User Input:**
   - Single: Form fields for article name, keywords, config.
   - Bulk: Excel upload, parsed into structured input.
2. **Content Generation:**
   - Outline generated via Grok API.
   - For each section, content is expanded and enriched.
   - FAQs and metadata generated in parallel.
3. **Result Aggregation:**
   - All results merged into final article objects.
   - Cost and progress tracked and displayed.
4. **Output:**
   - Articles displayed in the UI or exported as needed.

### Extensibility

- Add new languages or models by extending config and utility functions.
- Modular steps allow for custom article workflows.
- Easily integrate additional APIs or enrichers.

## Getting Started

1. **Install dependencies:**
   ```bash
   yarn
   ```
2. **Start the development server:**
   ```bash
   yarn dev
   ```

## Usage

### Single Article Generation

- **Inputs:**
  - **Article Name**: Title of your article.
  - **Keywords**: Relevant keywords (see field examples in the app).
  - **Additional Configuration (IT):**
    - Number of headings/subheadings
    - Minimum words per section
    - Number of FAQs
    - Language
    - Tags
  - **Additional Configuration (DE):**
    - Instructions
    - Target Group

### Bulk Article Generation

- **Prepare your Excel file** using the following structure (IT example):

  | Article Name                | Keywords                        | Language | Number of Headings | Number of FAQs | Minimum Number of Words | Tags           |
  |-----------------------------|----------------------------------|----------|--------------------|----------------|------------------------|----------------|
  | demolizione delle fondamenta| costruzione, ristrutturazione, prezzo | it       | 10                 | 5              | 1500                   | articleIT,2025 |

- **Upload the file** in the app and select your desired model and options.

## Grok Model

- Choose your preferred Grok model for article generation.
- Select single or bulk mode as needed.

## Support

For issues or feature requests, please open an issue in this repository.

