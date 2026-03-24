'use server';
/**
 * @fileOverview A Genkit tool for retrieving user-specific data like cart, wishlist, and orders.
 * In a real-world scenario, these functions would securely fetch data for the logged-in user.
 * For this demo, we will use mock data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getProducts, getTransactions } from '@/lib/data'; // Assuming these functions can be used to get mock data

// Mock function to simulate fetching a user's cart
export const getCartContents = ai.defineTool(
    {
        name: 'getCartContents',
        description: 'Retrieves the items currently in the user\'s shopping cart.',
        input: z.object({}),
        output: z.object({
            items: z.array(z.object({
                name: z.string(),
                price: z.number(),
                quantity: z.number(),
            })).describe('A list of items in the cart.'),
        }),
    },
    async () => {
        console.log('Tool: Getting cart contents...');
        const allProducts = await getProducts();
        // Mock: Add first 2 products to cart
        return {
            items: allProducts.slice(0, 2).map(p => ({
                name: p.name,
                price: p.price,
                quantity: 1,
            }))
        };
    }
);

// Mock function to simulate fetching a user's wishlist
export const getWishlistContents = ai.defineTool(
    {
        name: 'getWishlistContents',
        description: 'Retrieves the items currently in the user\'s wishlist.',
        input: z.object({}),
        output: z.object({
            items: z.array(z.object({
                name: z.string(),
                price: z.number(),
            })).describe('A list of items in the wishlist.'),
        }),
    },
    async () => {
        console.log('Tool: Getting wishlist contents...');
        const allProducts = await getProducts();
        // Mock: Add products 3-5 to wishlist
        return {
            items: allProducts.slice(2, 5).map(p => ({
                name: p.name,
                price: p.price,
            }))
        };
    }
);


// Mock function to simulate fetching a user's order history
export const getUserOrders = ai.defineTool(
    {
        name: 'getUserOrders',
        description: 'Retrieves the past orders for the current user.',
        input: z.object({}),
        output: z.object({
            orders: z.array(z.object({
                productName: z.string(),
                date: z.string(),
                status: z.string(),
            })).describe('A list of past orders.'),
        }),
    },
    async () => {
        console.log('Tool: Getting user orders...');
        const allTransactions = await getTransactions();
        // Mock: Return first 2 transactions as user's orders
        return {
            orders: allTransactions.slice(0, 2).map(t => ({
                productName: t.productName,
                date: t.date,
                status: t.status,
            }))
        };
    }
);
