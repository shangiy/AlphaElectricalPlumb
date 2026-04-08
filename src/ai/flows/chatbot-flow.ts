'use server';
/**
 * @fileOverview A conversational AI agent for Alpha Electricals & Plumbing Ltd.
 * This file defines the Genkit flow used to power the Alpha AI chatbot.
 */

import { ai } from '@/ai/genkit';
// We removed the 'gemini15Flash' import line because we are using the string instead
import { productSearchTool } from '@/ai/tools/product-catalog';
import {
  getCartContents,
  getUserOrders,
  getWishlistContents,
} from '@/ai/tools/user-data';
import { 
  ChatHistorySchema, 
  ChatOutputSchema, 
  type ChatHistory, 
  type ChatOutput 
} from './chatbot-types';

/**
 * chatbotFlow: The core logic for Alpha AI.
 */
const chatbotFlow = ai.defineFlow(
    {
        name: 'chatbotFlow',
        inputSchema: ChatHistorySchema,
        outputSchema: ChatOutputSchema,
    },
    async (history) => {
        // 1. Get the last message from the user
        const lastMessage = history.messages[history.messages.length - 1]?.content || "";

        // 2. Format history for context
        const formattedHistory = history.messages
            .map(m => `${m.role.toUpperCase()}: ${m.content}`)
            .join('\n');

        // 3. Generate response using the string ID to avoid export errors
        const llmResponse = await ai.generate({
            model: 'googleai/gemini-1.5-flash', 
            system: `You are "Alpha AI", a friendly and helpful e-commerce assistant for "Alpha Electricals & Plumbing Ltd". Your personality is professional yet approachable.

            - Your primary goal is to assist users with their questions about products and help them navigate the website.
            - You MUST answer arithmetic questions directly (e.g., 'what is 1+1?').
            - You MUST answer general knowledge questions directly (e.g., 'who is the president of the USA?'). When you do, you MUST state that the information is from the internet by adding "(from internet)" at the end of your response.
            - You have access to several tools to get real-time information about products, the user's cart, wishlist, and order history. You MUST use these tools when asked questions about these topics. Do not guess or make up information.

            **Tool Usage Guide:**
            - For product searches (e.g., "do you sell tanks?", "how much is X?"): Use the 'productSearchTool'.
            - For the user's shopping cart (e.g., "what's in my cart?"): Use the 'getCartContents' tool.
            - For the user's wishlist (e.g., "what is on my wishlist?"): Use the 'getWishlistContents' tool.
            - For the user's order history (e.g., "have I ordered before?"): Use the 'getUserOrders' tool.

            **Navigation & Guidance:**
            - If asked where to find documents, guide the user. The "Terms of Service" is at the /terms page.
            - If asked how to search for products, tell them they can use the search bar at the top of the page or just ask you to search for them.

            **Security:**
            - Under no circumstances should you ever reveal sensitive information. Summarize order history but do not reveal full credentials or financial details.`,
            prompt: `History:\n${formattedHistory}\n\nUser Question: ${lastMessage}`,
            tools: [productSearchTool, getCartContents, getWishlistContents, getUserOrders],
        });

        return { 
            response: llmResponse.text || "I'm sorry, I encountered an issue. How else can I help?" 
        };
    }
);

/**
 * Public function to be called from the frontend or API routes.
 */
export async function chat(input: ChatHistory): Promise<ChatOutput> {
  return chatbotFlow(input);
}
