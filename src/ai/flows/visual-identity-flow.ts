'use server';
/**
 * @fileOverview Visual Identity AI Agent.
 * 
 * Analyzes images of products, barcodes, or QR codes to extract 
 * technical details for search or inventory management.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const VisualIdentityInputSchema = z.object({
  imageDataUri: z.string().describe("The base64 encoded image data URI."),
});
export type VisualIdentityInput = z.infer<typeof VisualIdentityInputSchema>;

const VisualIdentityOutputSchema = z.object({
  detectedBarcode: z.string().optional().describe("The alphanumeric value of any detected barcode or QR code."),
  suggestedName: z.string().describe("A clear, professional product name based on visual features."),
  suggestedCategory: z.string().optional().describe("The best fit category from Alpha's inventory structure."),
  searchQuery: z.string().describe("A concise query for finding this item in a text-based search."),
  technicalFeatures: z.array(z.string()).describe("List of identified physical or technical characteristics."),
});
export type VisualIdentityOutput = z.infer<typeof VisualIdentityOutputSchema>;

export async function identifyProductVisually(input: VisualIdentityInput): Promise<VisualIdentityOutput> {
  return visualIdentityFlow(input);
}

const visualIdentityFlow = ai.defineFlow(
  {
    name: 'visualIdentityFlow',
    inputSchema: VisualIdentityInputSchema,
    outputSchema: VisualIdentityOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      output: { schema: VisualIdentityOutputSchema },
      system: `You are an expert industrial supply specialist for Alpha Electricals & Plumbing Ltd. 
      Your task is to analyze product images or labels.
      
      1. CODES: If a barcode or QR code is visible, extract its value exactly.
      2. IDENTIFICATION: Identify the specific plumbing, electrical, or construction item.
      3. CATEGORIES: Map to one of: 'Decorative Lighting and chandeliers', 'Electrical items', 'Plumbing', 'Sanitary Ware Toilets & Bathroom Fixtures', 'Shower Category', 'Solar panels & accessories', 'Tanks category', 'Mabati and Roofing', 'Construction and Fencing equip\'nts', 'Collections'.
      4. SEARCH: Provide a query string that helps a database find this exact or most similar item.`,
      prompt: [
        { media: { url: input.imageDataUri } },
        { text: "Examine this product capture. Extract barcode if present, identify the item, and suggest catalog details." }
      ],
    });

    if (!output) {
        throw new Error("AI failed to process the visual capture.");
    }

    return output;
  }
);
