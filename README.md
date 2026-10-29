
# ALPHA Plumbing n Electrical Ltd 

This is a professional Next.js 15 e-commerce application for Alpha Electricals & Plumbing Ltd.

## 🚀 Shifting from Firebase to Supabase

Due to Firebase billing issues, the backend has been migrated to Supabase.

### 🛠️ Supabase Configuration
You must provide the following environment variables in your Vercel Dashboard (**Project Settings > Environment Variables**):

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your secret service role key (Required for Admin uploads and role management).

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

-- Safely add any missing columns (e.g. for existing projects)
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

-- 4. Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
```

### 📂 Storage Setup (Bucket Separation)
To ensure independent storage for products, avatars, and search logs, run this in your Supabase SQL Editor:

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
To enforce the maximum limit of 4 administrators in your database, run this SQL script:

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
