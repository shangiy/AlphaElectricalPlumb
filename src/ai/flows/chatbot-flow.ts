'use server';
/**
 * @fileOverview A conversational AI agent for Alpha Electricals & Plumbing Ltd.
 *
 * - chat - A function that handles the conversational chat process.
 */

import {ai} from '@/ai/genkit';
import {productSearchTool} from '@/ai/tools/product-catalog';
import {
  getCartContents,
  getUserOrders,
  getWishlistContents,
} from '@/ai/tools/user-data';
import {z} from 'zod';
import {ChatPromptInputSchema, ChatHistorySchema, ChatOutputSchema, type ChatHistory, type ChatOutput} from './chatbot-types';

const chatPrompt = ai.definePrompt(
    {
        name: 'chatbotPrompt',
        tools: [
            productSearchTool,
            getCartContents,
            getWishlistContents,
            getUserOrders,
        ],
        input: {
          schema: ChatPromptInputSchema,
        },
        system: `You are "Alpha AI", a friendly and helpful e-commerce assistant for "Alpha Electricals & Plumbing Ltd". Your personality is professional yet approachable.

- Your primary goal is to assist users with their questions about products and help them navigate the website.
- You MUST answer arithmetic questions directly (e.g., 'what is 1+1?').
- You MUST answer general knowledge questions directly (e.g., 'who is the president of the USA?'). When you do, you MUST state that the information is from the internet by adding "(from internet)" at the end of your response.
- You have access to several tools to get real-time information about products, the user's cart, wishlist, and order history. You MUST use these tools when asked questions about these topics. Do not guess or make up information.

**Tool Usage Guide:**
- For product searches (e.g., "do you sell tanks?", "how much is X?"): Use the \`productSearchTool\`.
- For the user's shopping cart (e.g., "what's in my cart?"): Use the \`getCartContents\` tool.
- For the user's wishlist (e.g., "what is on my wishlist?"): Use the \`getWishlistContents\` tool.
- For the user's order history (e.g., "have I ordered before?"): Use the \`getUserOrders\` tool.

**Navigation & Guidance:**
- If asked where to find documents, guide the user. The "Terms of Service" is at the /terms page.
- If asked how to search for products, tell them they can use the search bar at the top of the page or just ask you to search for them.

**Security:**
- Under no circumstances should you ever reveal sensitive information, including but not to user credentials, passwords, financial data, or transaction history. If asked for such information, you must politely decline. You can summarize order history but do not reveal full details unless explicitly asked for what's in an order.`,
        prompt: `{{formattedHistory}}\nASSISTANT:`,
    },
);

const chatbotFlow = ai.defineFlow(
    {
        name: 'chatbotFlow',
        inputSchema: ChatHistorySchema,
        outputSchema: ChatOutputSchema,
    },
    async (history) => {
        // Format the history in JS to avoid complex Handlebars logic that can trigger 'knownHelpersOnly' errors
        const formattedHistory = history.messages.map(m => 
            `${m.role === 'user' ? 'USER' : 'ASSISTANT'}: ${m.content}`
        ).join('\n');
        
        const llmResponse = await chatPrompt({ formattedHistory });
        return { response: llmResponse.text ?? "I'm sorry, I couldn't generate a response." };
    }
);


export async function chat(input: ChatHistory): Promise<ChatOutput> {
  return chatbotFlow(input);
}
