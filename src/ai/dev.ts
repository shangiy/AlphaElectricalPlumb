'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/product-recommendations.ts';
import '@/ai/flows/product-description-generator.ts';
import '@/ai/flows/chatbot-flow.ts';
import '@/ai/flows/send-order-confirmation-email.ts';
import '@/ai/flows/send-newsletter-subscription-email.ts';
import '@/ai/tools/product-catalog.ts';
import '@/ai/tools/user-data.ts';
