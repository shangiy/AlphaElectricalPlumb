'use server';

/**
 * @fileOverview Server Actions for Global UI/UX Settings.
 * Handles Top Banner text, Search suggestions, and Category management.
 */

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function getSiteSetting(key: string) {
    if (!supabaseAdmin) return null;
    const { data } = await supabaseAdmin.from('site_settings').select('value').eq('key', key).maybeSingle();
    return data?.value;
}

export async function updateSiteSetting(key: string, value: any) {
    if (!supabaseAdmin) throw new Error("Admin client not configured.");
    
    const { error } = await supabaseAdmin
        .from('site_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
        
    if (error) throw error;
    
    revalidatePath('/');
    revalidatePath('/admin/featured');
}

export async function updateCategoryAdmin(id: string, payload: any) {
    if (!supabaseAdmin) throw new Error("Admin client not configured.");
    
    const { error } = await supabaseAdmin.from('categories').update(payload).eq('id', id);
    if (error) throw error;
    
    revalidatePath('/');
    revalidatePath('/admin/featured');
}

export async function addCategoryAdmin(payload: any) {
    if (!supabaseAdmin) throw new Error("Admin client not configured.");
    
    const { error } = await supabaseAdmin.from('categories').insert([payload]);
    if (error) throw error;
    
    revalidatePath('/');
    revalidatePath('/admin/featured');
}

export async function deleteCategoryAdmin(id: string) {
    if (!supabaseAdmin) throw new Error("Admin client not configured.");
    
    const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath('/');
    revalidatePath('/admin/featured');
}

export async function updateCategoryOrderAdmin(updates: { id: string, sort_order: number }[]) {
    if (!supabaseAdmin) throw new Error("Admin client not configured.");
    
    const promises = updates.map(u => 
        supabaseAdmin.from('categories').update({ sort_order: u.sort_order }).eq('id', u.id)
    );

    const results = await Promise.all(promises);
    const errors = results.filter(r => r.error);
    
    if (errors.length > 0) {
        console.error("Batch category update errors:", errors);
        throw new Error("Failed to synchronize category arrangement.");
    }

    revalidatePath('/');
}
