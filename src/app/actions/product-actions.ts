'use server';

/**
 * @fileOverview Server Actions for Admin Product Management.
 * Uses the Service Role client to bypass RLS for high-level admin operations.
 */

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function addProductAdmin(payload: any) {
  if (!supabaseAdmin) throw new Error("Supabase Admin client is not configured. Add SUPABASE_SERVICE_ROLE_KEY to environment variables.");
  
  const { error } = await supabaseAdmin.from('products').insert([payload]);
  if (error) throw error;
  
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateProductAdmin(id: string, payload: any) {
  if (!supabaseAdmin) throw new Error("Supabase Admin client is not configured.");
  
  const { error } = await supabaseAdmin.from('products').update(payload).eq('id', id);
  if (error) throw error;
  
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath(`/products/${id}`);
}

export async function deleteProductAdmin(id: string) {
  if (!supabaseAdmin) throw new Error("Supabase Admin client is not configured.");
  
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) throw error;
  
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function toggleFeaturedAdmin(id: string, status: boolean) {
  if (!supabaseAdmin) throw new Error("Supabase Admin client is not configured.");
  
  const { error } = await supabaseAdmin.from('products').update({ is_featured: !status }).eq('id', id);
  if (error) throw error;
  
  revalidatePath('/');
  revalidatePath('/admin/featured');
}

export async function updateFeaturedOrderAdmin(updates: { id: string, featured_order: number }[]) {
  if (!supabaseAdmin) throw new Error("Supabase Admin client is not configured.");
  
  // Update each item in the batch
  const promises = updates.map(update => 
    supabaseAdmin.from('products').update({ featured_order: update.featured_order }).eq('id', update.id)
  );

  const results = await Promise.all(promises);
  const errors = results.filter(r => r.error);
  
  if (errors.length > 0) {
    console.error("Batch update errors:", errors);
    throw new Error("One or more product order updates failed.");
  }

  revalidatePath('/');
  revalidatePath('/admin/featured');
}

export async function updateStockAdmin(id: string, newCount: number) {
  if (!supabaseAdmin) throw new Error("Supabase Admin client is not configured.");
  
  const { error } = await supabaseAdmin.from('products').update({ stock_count: Math.max(0, newCount) }).eq('id', id);
  if (error) throw error;
  
  revalidatePath('/');
}
