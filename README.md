
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
UPDATE public.profiles SET role = 'admin' WHERE email = 'mwangi.dev@proton.me';
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

### 🆘 Emergency RLS Reset (Fixes "Infinite Recursion")
If you see the "infinite recursion" error, your policies are looping. Run this script to break the loop:
```sql
-- 1. Wipe loop-causing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

-- 2. Re-apply simple, non-recursive logic
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

NOTIFY pgrst, 'reload schema';
```

### 📂 Storage Setup (Bucket Separation)
Run this to ensure independent storage for products, avatars, and search logs:

```sql
-- 1. Product Images Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public Access Products" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Allow Admin Uploads Products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- 2. User Avatars Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public Access Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Allow Admin Uploads Avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');

-- 3. User Selfies Bucket (Visual Search Logs)
INSERT INTO storage.buckets (id, name, public) VALUES ('user-selfies', 'user-selfies', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public Access Selfies" ON storage.objects FOR SELECT USING (bucket_id = 'user-selfies');
CREATE POLICY "Allow Admin Uploads Selfies" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-selfies');
```

### 🛡️ Admin Security (Limit to 4 Admins)
To enforce the maximum limit of 4 administrators:

```sql
create or replace function enforce_max_admins()
returns trigger as $$
begin
  if new.role = 'admin' and (select count(*) from public.profiles where role = 'admin') >= 4 then
    raise exception 'Maximum limit of 4 admins reached.';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger check_admin_limit
before insert or update on public.profiles
for each row execute procedure enforce_max_admins();
```

## 📅 Recent Milestones (v2.5.0)
- **Supabase Integration**: Migrated Auth, Database, and Storage from Firebase.
- **2027 Mobile UI**: Overhauled the mobile sidebar with fluid motions and glassmorphism.
- **Identity System**: Enhanced profile updates with custom avatar uploads and global name support.
- **Spotlight Manager**: Implemented persistent drag-and-drop sorting for featured homepage products.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / ShadCN UI
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: Firebase Genkit + Google Gemini
- **Payments**: Paystack Integration

## Local Development

1. Clone the repo: `git clone https://github.com/shangiy/AlphaElectricalPlumb.git`
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
