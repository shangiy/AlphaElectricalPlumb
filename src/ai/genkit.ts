import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai'; // Ensure this matches!

export const ai = genkit({
  plugins: [
    googleAI({ 
      apiKey: process.env.GEMINI_API_KEY 
    })
  ],
});
