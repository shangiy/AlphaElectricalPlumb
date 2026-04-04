/**
 * @fileOverview Types and schemas for the conversational AI agent.
 */
import {z} from 'zod';

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatHistorySchema = z.object({
  messages: z.array(ChatMessageSchema).describe("The history of the conversation."),
});
export type ChatHistory = z.infer<typeof ChatHistorySchema>;

export const ChatPromptInputSchema = z.object({
  formattedHistory: z.string().describe("The formatted conversation history."),
});
export type ChatPromptInput = z.infer<typeof ChatPromptInputSchema>;

export const ChatOutputSchema = z.object({
  response: z.string().describe("The chatbot's response to the user."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;
