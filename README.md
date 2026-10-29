
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
-- 1. Ensure the profiles table has ALL required columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';

-- 3. Enable RLS and setup Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to update their own record
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles 
FOR UPDATE USING (auth.uid() = id);

-- Policy: Allow users to view their own record
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles 
FOR SELECT USING (auth.uid() = id);

-- Policy: Allow public profile creation during signup
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);
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
