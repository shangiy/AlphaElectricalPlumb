'use server';

/**
 * @fileOverview Server Actions for Supabase Storage Management.
 * Uses the Service Role client to bypass RLS for administrative uploads.
 */

import { supabaseAdmin } from '@/lib/supabase-admin';

export async function uploadToStorageAdmin(formData: FormData) {
  if (!supabaseAdmin) {
    console.error("CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.");
    throw new Error("Admin configuration missing. Please add SUPABASE_SERVICE_ROLE_KEY to your Vercel environment variables.");
  }

  const file = formData.get('file') as File;
  const path = formData.get('path') as string;
  const bucket = (formData.get('bucket') as string) || 'product-images';

  if (!file) throw new Error("No file provided for upload.");
  if (!path) throw new Error("No destination path provided.");

  // Upload using the Admin client to bypass RLS policies
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type
    });

  if (error) {
    console.error(`Supabase Storage Upload Error (${bucket}):`, error);
    if (error.message.includes('violates row-level security')) {
        throw new Error(`Storage Permission Denied on bucket "${bucket}". Please ensure you are using the SERVICE_ROLE_KEY.`);
    }
    throw new Error(error.message);
  }

  // Generate the public URL for the newly uploaded file
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { publicUrl, path: data.path };
}
