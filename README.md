
# ALPHA Plumbing n Electrical Ltd

This is a professional Next.js 15 e-commerce application for Alpha Electricals & Plumbing Ltd, built with a modern stack featuring React, ShadCN UI, Tailwind, and Firebase.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / ShadCN UI
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: Firebase Genkit + Google Gemini
- **Payments**: Paystack Integration
- **Security**: Google reCAPTCHA v2 (Production Ready)

## Project Description

Alpha Electricals & Plumbing Ltd is a comprehensive e-commerce platform for home infrastructure and utility supplies. Key features include:

- **Product Catalog**: Multi-category browsing (Tanks, Plumbing, Lighting, Decor, Roofing) with detailed product specifications and image carousels.
- **AI Integration**: 
  - **Alpha AI Chatbot**: Conversational assistant for product queries and order support.
  - **Visual Search**: Users can capture photos to search for matching products.
  - **AI Description Generator**: Admin tool to create compelling product copy.
- **Customer Engagement**:
  - **Dynamic Reviews**: Real-time customer feedback section on the homepage where users can read and post reviews.
  - **Newsletter**: Automated subscription flow.
- **E-commerce Workflow**: Persistent shopping cart, location-based shipping calculation, and secure checkout via Paystack.
- **Order Management**: Real-time order tracking with status updates and map integration.
- **Admin Suite**: A full-featured dashboard with analytics, inventory management (add/edit products with AI assistance), and user moderation.

## 🚀 Pushing Changes to GitHub

To update your live site on Firebase App Hosting, run these commands in your **Git Bash**:

1. **Stage changes**: 
   ```bash
   git add .
   ```
2. **Commit**: 
   ```bash
   git commit -m "feat: finalize reCAPTCHA production setup and dynamic reviews"
   ```
3. **Push**: 
   ```bash
   git push origin main
   ```

## 🛠️ Deployment Checklist

Your build will fail unless you provide the following configuration in the Firebase Console under **App Hosting > Your App > Settings > Environment Variables**:

### Firebase Config
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Security & Payments
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`: Your Paystack Live or Test Public Key.
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`: Use `6LdFm5gsAAAAALfceOcW6y-68tEYEzNySihKjEzq` (Production Site Key).
- `RECAPTCHA_SECRET_KEY`: Use `6LdFm5gsAAAAANJSHWEzgIUAAOjB12wVOY_kxuhv` (Production Secret Key).

## Local Development

1. Clone the repo: `git clone https://github.com/shangiy/AlphaElectricalPlumb.git`
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
