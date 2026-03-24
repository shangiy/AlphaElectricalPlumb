'use server';

/**
 * @fileOverview A product description generator AI agent.
 *
 * - generateProductDescription - A function that handles the product description generation process.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateProductDescriptionInputSchema = z.object({
  productTitle: z.string().describe('The title of the product.'),
  productImageDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateProductDescriptionInput = z.infer<
  typeof GenerateProductDescriptionInputSchema
>;

const GenerateProductDescriptionOutputSchema = z.object({
  productDescription: z.string().describe('The generated product description, formatted as 3-4 distinct sentences, with each sentence on a new line.'),
});
export type GenerateProductDescriptionOutput = z.infer<
  typeof GenerateProductDescriptionOutputSchema
>;

export async function generateProductDescription(
  input: GenerateProductDescriptionInput
): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in creating compelling product descriptions for e-commerce.

  Based on the product title and optional image, generate a detailed and engaging product description that highlights the key features and benefits. The description should be 3-4 concise, engaging sentences. Each sentence must be on a new line.

  Product Title: {{{productTitle}}}
  {{#if productImageDataUri}}
  Image: {{media url=productImageDataUri}}
  {{/if}}`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
