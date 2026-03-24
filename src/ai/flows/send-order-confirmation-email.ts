
'use server';

/**
 * @fileOverview A flow for sending order confirmation emails.
 * In a real application, this would integrate with an email service like SendGrid or Resend.
 * For this demo, it will log the email content to the server console.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const EmailInputSchema = z.object({
  orderId: z.string().describe("The unique ID of the order."),
  productName: z.string().describe("The name of the product(s) ordered."),
  totalAmount: z.number().describe("The total amount of the order."),
  deliveryAddress: z.string().describe("The customer's delivery address."),
  customerEmail: z.string().email().describe("The customer's email address."),
});
export type EmailInput = z.infer<typeof EmailInputSchema>;

const EmailOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type EmailOutput = z.infer<typeof EmailOutputSchema>;


export async function sendOrderConfirmationEmail(input: EmailInput): Promise<EmailOutput> {
  return sendEmailFlow(input);
}


const sendEmailFlow = ai.defineFlow(
  {
    name: 'sendEmailFlow',
    inputSchema: EmailInputSchema,
    outputSchema: EmailOutputSchema,
  },
  async (input) => {
    
    // In a real application, this is where you would integrate with your email provider's SDK.
    // For example: await resend.emails.send({ from: '...', to: '...', subject: '...', html: '...' });

    console.log("--- SIMULATING SENDING EMAIL ---");
    console.log("To: patrickshangstone22@gmail.com");
    console.log("From: noreply@alpha-electricals.com");
    console.log("Subject: New Order Confirmation!");
    console.log("---------------------------------");
    console.log("Body:");
    console.log(`A new order has been placed and paid for.`);
    console.log(`Order ID: ${input.orderId}`);
    console.log(`Products: ${input.productName}`);
    console.log(`Total Amount: KES ${input.totalAmount.toLocaleString()}`);
    console.log(`Delivery Address: ${input.deliveryAddress}`);
    console.log(`Customer Email: ${input.customerEmail}`);
    console.log("---------------------------------");

    // We'll assume the email was sent successfully.
    return {
      success: true,
      message: "Order confirmation email sent successfully (logged to console).",
    };
  }
);
