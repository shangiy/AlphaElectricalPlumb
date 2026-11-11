'use server';

/**
 * @fileOverview Server Actions for Supabase Storage Management.
 * Uses the Service Role client to bypass RLS for administrative uploads.
 * Hardened for serializability to fix Next.js "Unexpected Response" errors.
 */

import { supabaseAdmin } from '@/lib/supabase-admin';

export async function uploadToStorageAdmin(formData: FormData) {
  if (!supabaseAdmin) {
    return { success: false, error: "Admin configuration missing (SUPABASE_SERVICE_ROLE_KEY)." };
  }

  try {
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;
    const bucket = (formData.get('bucket') as string) || 'product-images';

    if (!file) return { success: false, error: "No file provided for upload." };
    if (!path) return { success: false, error: "No destination path provided." };

    // AUTO-CREATE BUCKET FALLBACK: Ensure the bucket exists
    await supabaseAdmin.storage.createBucket(bucket, { public: true }).catch(() => {
        // Silently continue if bucket exists
    });

    // Upload using the Admin client to bypass RLS policies
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'application/octet-stream'
      });

    if (error) {
      console.error(`Supabase Storage Upload Error (${bucket}):`, error);
      return { success: false, error: error.message };
    }

    // Generate the public URL for the newly uploaded file
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { success: true, publicUrl, path: data.path };
  } catch (e: any) {
    console.error("Storage Action Exception:", e);
    return { success: false, error: e.message || "Internal server error during file processing." };
  }
}
