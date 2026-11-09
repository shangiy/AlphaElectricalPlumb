
'use server';
/**
 * @fileOverview A conversational AI agent for Alpha Electricals & Plumbing Ltd.
 * Implements a Hybrid Architecture: Catalog Matching First (Free) -> AI Fallback (Gemini).
 */

import { ai } from '@/ai/genkit';
import { getProducts } from '@/lib/data';
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
 * Now features an optimized keyword matching engine to reduce LLM calls.
 */
const chatbotFlow = ai.defineFlow(
    {
        name: 'chatbotFlow',
        inputSchema: ChatHistorySchema,
        outputSchema: ChatOutputSchema,
    },
    async (history) => {
        const lastMessage = history.messages[history.messages.length - 1]?.content || "";
        const lowerMessage = lastMessage.toLowerCase();

        // 1. SMART KEYWORD & CATALOG MATCHING (Zero API Key Path)
        // Identify if the message is a direct product or shop inquiry
        const productKeywords = [
            "tank", "pipe", "wire", "cable", "socket", "light", "pvc", "ppr", 
            "roofing", "mabati", "solar", "heater", "sink", "toilet", "tap", "valve",
            "switch", "circuit", "breaker", "pump", "tile", "paint", "cement"
        ];
        
        const inquiryKeywords = ["have", "sell", "price", "cost", "much", "buy", "available", "where", "location", "find"];
        
        const containsProduct = productKeywords.some(k => lowerMessage.includes(k));
        const isShopInquiry = inquiryKeywords.some(k => lowerMessage.includes(k));

        // If it looks like a direct catalog query, try to answer for free
        if (containsProduct || (isShopInquiry && lowerMessage.length < 50)) {
            const allProducts = await getProducts();
            const matches = allProducts.filter(p => {
                const name = p.name.toLowerCase();
                const cat = p.category.toLowerCase();
                return productKeywords.some(k => lowerMessage.includes(k) && (name.includes(k) || cat.includes(k)));
            }).slice(0, 4);

            if (matches.length > 0) {
                let response = "I found some high-quality items in our catalog matching your request:\n\n";
                matches.forEach(p => {
                    const priceStr = p.price > 0 ? `KES ${p.price.toLocaleString()}` : "Contact for Price";
                    response += `- **${p.name}**: ${priceStr} (${p.category})\n`;
                });
                response += "\n(Catalog Result) You can click on 'Product Catalogue' to see more, or ask me for technical advice!";
                return { response };
            }
            
            // Handle location/contact inquiries directly
            if (lowerMessage.includes('where') || lowerMessage.includes('location') || lowerMessage.includes('place')) {
                return { 
                    response: "Alpha Electricals & Plumbing Ltd is located at Nandi Arcade (Office 204) and Kisumu Ndogo (Opp. Naivas) in Eldoret. We are open Mon - Sat, 8:00 AM - 6:00 PM. (Catalog Result)" 
                };
            }
        }

        // 2. FALLBACK TO GEMINI (Conversational / Advanced Logic)
        // Used for general knowledge, complex advice, or if direct matching failed
        const formattedHistory = history.messages
            .map(m => `${m.role.toUpperCase()}: ${m.content}`)
            .join('\n');

        const llmResponse = await ai.generate({
            model: 'googleai/gemini-1.5-flash', 
            system: `You are "Alpha AI", the professional virtual assistant for "Alpha Electricals & Plumbing Ltd". 
            
            - PERSONALITY: Professional, helpful, and industrial-focused.
            - KNOWLEDGE: You assist with electrical fittings, plumbing systems, and general site inquiries.
            - FALLBACK MODE: Use this mode when you need to explain technical details or if the direct catalog match missed something.
            - INTERNET DATA: If providing general knowledge (e.g. news or unrelated math), append "(from internet)".
            - TOOLS: You have real-time access to the product search and user data tools. Use them to verify details if the user asks for specific inventory info you don't have yet.`,
            prompt: `Conversation Context:\n${formattedHistory}\n\nClient Question: ${lastMessage}`,
            tools: [productSearchTool, getCartContents, getWishlistContents, getUserOrders],
        });

        return { 
            response: llmResponse.text || "I apologize, I'm having trouble accessing my database right now. Please try again or contact us via WhatsApp." 
        };
    }
);

/**
 * Public function to be called from the frontend or API routes.
 */
export async function chat(input: ChatHistory): Promise<ChatOutput> {
  return chatbotFlow(input);
}
