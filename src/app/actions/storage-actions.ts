'use server';

/**
 * @fileOverview Server Actions for Supabase Storage Management.
 * Uses the Service Role client to bypass RLS for administrative uploads.
 */

import { supabaseAdmin } from '@/lib/supabase-admin';

export async function uploadToStorageAdmin(formData: FormData) {
  if (!supabaseAdmin) {
    throw new Error("Supabase Admin client is not configured. Ensure SUPABASE_SERVICE_ROLE_KEY is set in environment variables.");
  }

  const file = formData.get('file') as File;
  const path = formData.get('path') as string;

  if (!file) throw new Error("No file provided for upload.");
  if (!path) throw new Error("No destination path provided.");

  // Upload using the Admin client to bypass RLS policies
  const { data, error } = await supabaseAdmin.storage
    .from('product-images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type
    });

  if (error) {
    console.error("Supabase Storage Admin Upload Error:", error);
    throw new Error(error.message);
  }

  // Generate the public URL for the newly uploaded file
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return { publicUrl, path: data.path };
}
