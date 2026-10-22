
# ALPHA Plumbing n Electrical Ltd 

This is a professional Next.js 15 e-commerce application for Alpha Electricals & Plumbing Ltd.

## 🚀 Shifting from Firebase to Supabase

Due to Firebase billing issues, the backend has been migrated to Supabase.

### 🛠️ Supabase Configuration
You must provide the following environment variables in your Vercel Dashboard (**Project Settings > Environment Variables**):

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key.

### 📂 Image Management
To save costs on Cloud Storage, images are served from Supabase Storage or the `public` folder.
1. The app features a **Self-Healing Image Resolver** that automatically finds working links in your Supabase bucket.
2. New images uploaded via the Admin Dashboard go directly to the Supabase `product-images` bucket.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / ShadCN UI
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: Firebase Genkit + Google Gemini
- **Payments**: Paystack Integration

## 🚀 Deployment Commands (Recommended)

To update your live site on Vercel with the latest synchronization and visual fixes:

1. **Stage changes**: 
   ```bash
   git add .
   ```
2. **Commit**: 
   ```bash
   git commit -m "feat: align category visuals with subfolder assets and sync Supabase role-based architecture"
   ```
3. **Push**: 
   ```bash
   git push origin main
   ```

## Local Development

1. Clone the repo: `git clone https://github.com/shangiy/AlphaElectricalPlumb.git`
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
