
'use server';
/**
 * @fileOverview A Genkit tool for searching the product catalog.
 */

import {ai} from '@/ai/genkit';
import {getProducts} from '@/lib/data';
import {z} from 'zod';

const ProductSearchInputSchema = z.object({
  query: z
    .string()
    .describe('A search query to find products in the catalog.'),
});

const ProductSearchOutputSchema = z.object({
  products: z
    .array(
      z.object({
        name: z.string(),
        price: z.number(),
        category: z.string(),
        description: z.string(),
        imageUrls: z.array(z.string()),
      })
    )
    .describe('A list of products that match the query.'),
});

export const productSearchTool = ai.defineTool(
  {
    name: 'productSearchTool',
    description: 'Searches the Alpha Electricals product catalog for specific items.',
    inputSchema: ProductSearchInputSchema,
    outputSchema: ProductSearchOutputSchema,
  },
  async (input) => {
    console.log('Searching for products with query:', input.query);

    if (!input.query) {
      return { products: [] };
    }
    
    const allProducts = await getProducts();
    const lowerCaseQuery = input.query.toLowerCase();

    const filteredProducts = allProducts
      .filter(
        product =>
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.description.toLowerCase().includes(lowerCaseQuery) ||
          product.category.toLowerCase().includes(lowerCaseQuery)
      )
      .slice(0, 50) // Return a healthy list of matches
      .map(p => ({
        name: p.name,
        price: p.price,
        category: p.category,
        description: p.description,
        imageUrls: p.imageUrls || [] 
      }));

    return { products: filteredProducts };
  }
);
