'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a creative writing prompt tailored to the author's style and blog content.
 *
 * generateInspirationPrompt - An async function that returns an AI-generated writing prompt.
 * GenerateInspirationPromptOutput - The output type for the generateInspirationPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInspirationPromptOutputSchema = z.object({
  prompt: z.string().describe('A creative writing prompt tailored to the author.'),
  shouldSuggest: z.boolean().describe('Whether the user may require the prompt.'),
});
export type GenerateInspirationPromptOutput = z.infer<typeof GenerateInspirationPromptOutputSchema>;

export async function generateInspirationPrompt(): Promise<GenerateInspirationPromptOutput> {
  return generateInspirationPromptFlow();
}

const prompt = ai.definePrompt({
  name: 'inspirationPrompt',
  output: {schema: GenerateInspirationPromptOutputSchema},
  prompt: `You are a writing assistant for a writer who blogs about nature and personal growth.
  Generate a creative writing prompt that aligns with the writer's style and previous blog posts.
  Assess whether the writer may be experiencing writer's block or a lack of inspiration today.
  If so, set the 'shouldSuggest' field to true, otherwise set to false. Base your assessment on general creative patterns and the need for diverse stimuli.
  Return a JSON object with a creative writing prompt in the 'prompt' field and a boolean value for 'shouldSuggest'.`,
});

const generateInspirationPromptFlow = ai.defineFlow({
  name: 'generateInspirationPromptFlow',
  outputSchema: GenerateInspirationPromptOutputSchema,
}, async () => {
  const {output} = await prompt({});
  return output!;
});
