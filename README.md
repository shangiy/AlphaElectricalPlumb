
# ALPHA Plumbing n Electrical Ltd

This is a professional Next.js 15 e-commerce application for Alpha Electricals & Plumbing Ltd, built with a modern stack featuring React, ShadCN UI, Tailwind, and Firebase.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / ShadCN UI
- **Backend**: Firebase (Auth, Firestore, Storage, Realtime Database)
- **AI**: Firebase Genkit + Google Gemini
- **Payments**: Paystack Integration

## Project Description (For Data Connect / Documentation)

Alpha Electricals & Plumbing Ltd is a comprehensive e-commerce platform for home infrastructure and utility supplies. Key features include:

- **Product Catalog**: Multi-category browsing (Tanks, Plumbing, Lighting, Decor, Roofing) with detailed product specifications, wholesale pricing, and image carousels.
- **AI Integration**: 
  - **Alpha AI Chatbot**: Conversational assistant for product queries and order support.
  - **Visual Search**: Users can capture photos to search for matching products.
  - **AI Description Generator**: Admin tool to create compelling product copy.
  - **Smart Recommendations**: Dynamic "You Might Also Like" sections based on user browsing.
- **E-commerce Workflow**: Persistent shopping cart, location-based shipping calculation, and secure checkout via Paystack.
- **Order Management**: Real-time order tracking with status updates and map integration.
- **Admin Suite**: A full-featured dashboard with sales analytics (charts), inventory management, user moderation, and transaction logging.
- **User Engagement**: Newsletter subscription, WhatsApp chat widget, and dynamic promotional banners.

## 🚀 Vercel / Firebase Deployment Checklist

Your build will fail unless you provide the Firebase configuration.

### Step 1: Add Environment Variables
Add the following keys to your deployment platform (Vercel/Firebase):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`

## Local Development

1. Clone the repo: `git clone https://github.com/shangiy/AlphaElectricalPlumb.git`
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
