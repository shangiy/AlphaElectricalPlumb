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
      })
    )
    .describe('A list of products that match the query.'),
});

async function searchProducts(
  input: z.infer<typeof ProductSearchInputSchema>
): Promise<z.infer<typeof ProductSearchOutputSchema>> {
  console.log('Searching for products with query:', input.query);

  // Handle cases where the query might be missing
  if (!input.query) {
    console.log('No query provided, returning empty product list.');
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
    .slice(0, 5) // Limit to 5 results to keep the response concise
    .map(p => ({
      name: p.name,
      price: p.price,
      category: p.category,
      description: p.description,
    }));

  return {products: filteredProducts};
}

export const productSearchTool = ai.defineTool(
  {
    name: 'productSearchTool',
    description: 'Search the product catalog to find product information like price, description, and availability.',
    input: {schema: ProductSearchInputSchema},
    output: {schema: ProductSearchOutputSchema},
  },
  searchProducts
);
