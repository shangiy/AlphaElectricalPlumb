
'use server';
/**
 * @fileOverview Provides product recommendations based on user search queries.
 *
 * - getProductRecommendations - A function that takes a search query and returns a list of recommended products.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ProductRecommendationsInputSchema = z.object({
  searchQuery: z.string().describe('The user\'s search query.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  products: z
    .array(
      z.object({
        name: z.string().describe('The name of the product.'),
        description: z.string().describe('A brief description of the product.'),
        imageUrl: z.string().describe('A URL to an image of the product.'),
        price: z.number().describe('The price of the product in Kenyan Shillings (KES).'),
      })
    )
    .describe('A list of recommended products.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are an e-commerce product recommendation expert.
  Based on the user's search query, provide a list of recommended products.
  Return a JSON array of products with name, description, imageUrl, and price in Kenyan Shillings (KES).
  For the imageUrl, you can use an empty string if no suitable image is available.

  Search Query: {{{searchQuery}}}
  `, 
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
