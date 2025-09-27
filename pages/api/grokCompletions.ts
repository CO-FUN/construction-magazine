import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: process.env.XAI_API_KEY || '', // Securely access the API key from server-side environment variables
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const completion = await client.chat.completions.create({
      model: model || 'grok-3-mini',
      messages,
      temperature: 0,
    });

    res.status(200).json({
      id: completion.id,
      object: completion.object,
      created: completion.created,
      choices: completion.choices.map((choice) => ({
        message: choice.message,
      })),
      usage: completion.usage, // Include usage field for cost calculations
      model: completion.model,
    });
  } catch (error) {
    console.error('Error in Grok API route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
