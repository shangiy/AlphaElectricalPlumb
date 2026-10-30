'use server';

/**
 * @fileOverview Server Actions for Storefront CMS Management.
 * Handles persistence for Hero slides, Search suggestions, and About Us content.
 */

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function getStorefrontSetting(key: string) {
    if (!supabaseAdmin) return null;
    const { data } = await supabaseAdmin.from('storefront_settings').select('content').eq('key', key).maybeSingle();
    return data?.content;
}

export async function updateStorefrontSetting(key: string, content: any) {
    if (!supabaseAdmin) throw new Error("Admin client not configured.");
    
    const { error } = await supabaseAdmin
        .from('storefront_settings')
        .upsert({ key, content, updated_at: new Date().toISOString() }, { onConflict: 'key' });
        
    if (error) throw error;
    
    revalidatePath('/');
    revalidatePath('/admin/cms');
}

export async function toggleReviewVisibility(id: string, isHidden: boolean) {
    if (!supabaseAdmin) throw new Error("Admin client not configured.");
    const { error } = await supabaseAdmin.from('reviews').update({ is_hidden: isHidden }).eq('id', id);
    if (error) throw error;
    revalidatePath('/');
}

export async function updateReviewOrder(updates: { id: string, sort_order: number }[]) {
    if (!supabaseAdmin) throw new Error("Admin client not configured.");
    const promises = updates.map(u => 
        supabaseAdmin.from('reviews').update({ sort_order: u.sort_order }).eq('id', u.id)
    );
    await Promise.all(promises);
    revalidatePath('/');
}
