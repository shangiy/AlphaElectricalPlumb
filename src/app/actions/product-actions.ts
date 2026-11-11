'use server';

/**
 * @fileOverview Server Actions for Admin Product Management.
 * Refined for Next.js 15 serializability to prevent "Unexpected Response" errors.
 */

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function addProductAdmin(payload: any) {
  if (!supabaseAdmin) return { success: false, error: "Admin client not configured." };
  
  try {
    const { error } = await supabaseAdmin.from('products').insert([payload]);
    if (error) return { success: false, error: error.message };
    
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || "Insert failed." };
  }
}

export async function updateProductAdmin(id: string, payload: any) {
  if (!supabaseAdmin) return { success: false, error: "Admin client not configured." };
  
  try {
    const { error } = await supabaseAdmin.from('products').update(payload).eq('id', id);
    if (error) return { success: false, error: error.message };
    
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath(`/products/${id}`);
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || "Update failed." };
  }
}

export async function deleteProductAdmin(id: string) {
  if (!supabaseAdmin) return { success: false, error: "Admin client not configured." };
  
  try {
    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || "Delete failed." };
  }
}

export async function toggleFeaturedAdmin(id: string, status: boolean) {
  if (!supabaseAdmin) return { success: false, error: "Admin client not configured." };
  
  try {
    const { error } = await supabaseAdmin.from('products').update({ is_featured: !status }).eq('id', id);
    if (error) return { success: false, error: error.message };
    
    revalidatePath('/');
    revalidatePath('/admin/featured');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || "Toggle failed." };
  }
}

export async function updateFeaturedOrderAdmin(updates: { id: string, featured_order: number }[]) {
  if (!supabaseAdmin) return { success: false, error: "Admin client not configured." };
  
  try {
    const promises = updates.map(update => 
      supabaseAdmin.from('products').update({ featured_order: update.featured_order }).eq('id', update.id)
    );

    const results = await Promise.all(promises);
    const errors = results.filter(r => r.error);
    
    if (errors.length > 0) {
      return { success: false, error: "Batch update failed for some items." };
    }

    revalidatePath('/');
    revalidatePath('/admin/featured');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || "Reordering failed." };
  }
}

export async function updateStockAdmin(id: string, newCount: number) {
  if (!supabaseAdmin) return { success: false, error: "Admin client not configured." };
  
  try {
    const { error } = await supabaseAdmin.from('products').update({ stock_count: Math.max(0, newCount) }).eq('id', id);
    if (error) return { success: false, error: error.message };
    
    revalidatePath('/');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message || "Stock update failed." };
  }
}
