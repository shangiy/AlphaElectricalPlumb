
# ALPHA Plumbing n Electrical Ltd 

This is a professional Next.js 15 e-commerce application for Alpha Electricals & Plumbing Ltd.

## 🚀 Shifting from Firebase to Supabase

Due to Firebase billing issues, the backend has been migrated to Supabase.

### 🛠️ Supabase Configuration
You must provide the following environment variables in your Vercel Dashboard (**Project Settings > Environment Variables**):

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your secret service role key (Required for Admin uploads and role management).

### 🔑 Initial Admin Setup (IMPORTANT)
The app uses role-based security. To access the admin panel (`/admin`):
1. Create an account on the website using your preferred email (e.g., `mwangi.dev@proton.me`).
2. Go to your **Supabase SQL Editor**.
3. Run the following command to promote yourself:
```sql
UPDATE public.profiles SET role = 'admin' SET email = 'mwangi.dev@proton.me';
```

### 👤 Profile & Database Setup (CRITICAL)
To ensure profile updates, avatars, and role management work correctly, run the following in your Supabase SQL Editor:

```sql
-- 1. Drop restrictive role check constraint if it exists
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Ensure the profiles table has ALL required columns
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    username TEXT,
    email TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Safely add any missing columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 3. Enable RLS and setup Master Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone." 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile." 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- 4. Add persistent reordering support to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS featured_order INT DEFAULT 0;

-- 5. Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
```

### 📅 Recent Milestones (v6.3.6)
- **Routing Consolidation**: Resolved Next.js 15 server crash by neutralizing duplicate dynamic routes and unifying the Product Detail engine into a "Slug-First" architecture.
- **Seasonal Event Engine**: Integrated the v4.7.0 thematic pill hub for holiday-specific marketing (Christmas, New Year, etc.).
- **Style Persistence**: Added iconic Black Friday style effects (Jumia and Amazon mimics) to the Vibrant Sticker Engine.
- **Architectural Solidification**: Finalized the Next.js 15 routing consolidation, eliminating segment conflicts and hardening `next.config.ts` for cloud environments.
- **CMS Ergonomics**: Refined the administrative layout for operational window toggles and global visibility management.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / ShadCN UI
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: Firebase Genkit + Google Gemini
- **Payments**: Paystack Integration
