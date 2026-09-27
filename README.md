
# ALPHA Plumbing n Electrical Ltd 

This is a professional Next.js 15 e-commerce application for Alpha Electricals & Plumbing Ltd.

## 🚀 Shifting from Firebase to Supabase

Due to Firebase billing issues, the backend has been migrated to Supabase.

### 🛠️ Supabase Configuration
You must provide the following environment variables in your Vercel Dashboard (**Project Settings > Environment Variables**):

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key.

### 📂 Image Management
To save costs on Cloud Storage, images can now be served from the `public` folder.
1. Place your product images in `public/product-images/`.
2. In your Supabase `products` table, set the `imageUrls` to use the filenames (e.g., `["tank-2000l.jpg"]`).
3. The app will automatically resolve these to `/product-images/tank-2000l.jpg`.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / ShadCN UI
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: Firebase Genkit + Google Gemini
- **Payments**: Paystack Integration

## 🚀 Pushing Changes to GitHub

To update your live site on Vercel, run these commands:

1. **Stage changes**: 
   ```bash
   git add .
   ```
2. **Commit**: 
   ```bash
   git commit -m "feat: migrate backend to supabase for cost efficiency"
   ```
3. **Push**: 
   ```bash
   git push origin main
   ```

## Local Development

1. Clone the repo: `git clone https://github.com/shangiy/AlphaElectricalPlumb.git`
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
