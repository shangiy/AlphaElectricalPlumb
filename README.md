
# ALPHA Plumbing n Electrical Ltd

This is a professional Next.js 15 e-commerce application for Alpha Electricals & Plumbing Ltd, built with a modern stack featuring React, ShadCN UI, Tailwind, and Firebase.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / ShadCN UI
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: Firebase Genkit + Google Gemini

## 🚀 Vercel Deployment Checklist (CRITICAL)

Your build will fail on Vercel unless you provide the Firebase configuration. Follow these steps:

### Step 1: Add Environment Variables to Vercel
1.  Open your project on the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Navigate to **Settings** > **Environment Variables**.
3.  Add the following 6 keys exactly as named below (use the values from your Firebase Console):
    - `NEXT_PUBLIC_FIREBASE_API_KEY`
    - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    - `NEXT_PUBLIC_FIREBASE_APP_ID`
4.  **Redeploy** the latest commit from the "Deployments" tab.

## Local Development

1.  Clone the repo: `git clone https://github.com/shangiy/AlphaElectricalPlumb.git`
2.  Install dependencies: `npm install`
3.  Run the dev server: `npm run dev`

## Troubleshooting

### GH007: Private Email Error
If GitHub blocks your push due to a private email address:
1. Find your no-reply email in [GitHub Settings](https://github.com/settings/emails).
2. Run:
   ```bash
   git config --global user.email "your-id+username@users.noreply.github.com"
   git commit --amend --reset-author --no-edit
   git push
   ```

### Firebase "auth/invalid-api-key"
This error occurs if Vercel tries to build pages without the API keys. Ensure Step 1 of the checklist is completed before deploying.
