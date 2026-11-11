'use server';

/**
 * @fileOverview Server Actions for Storefront CMS Management.
 * Refined for Next.js 15 serializability to fix Server Action Fetch errors.
 */

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export interface WordStyle {
    text: string;
    color: string;
    font: string;
}

export type HeroAnimation = 'fade' | 'zoom' | 'slide' | 'blur-fade';

export interface HeroSlide {
    id: string;
    headline: string;
    highlightedText: string;
    styleType: 'kenyan-flag' | 'gold-gradient' | 'neon-glow' | 'fire-emoji' | 'sparkle';
    subheading: string;
    ctaText: string;
    ctaLink: string;
    imageUrl: string; 
    imageUrls?: string[]; 
    order: number;
    active: boolean;
    headlineColor?: string;
    headlineSize?: number;
    headlineWeight?: string; 
    subheadingColor?: string;
    subheadingSize?: number;
    subheadingWeight?: string; 
    headlineTopMargin?: number; 
    subheadingTopMargin?: number; 
    topMargin?: number; 
    wordStyles?: WordStyle[];
    bgAnimation?: HeroAnimation;
}

export async function getStorefrontSetting(key: string) {
    if (!supabaseAdmin) return null;
    try {
        const { data } = await supabaseAdmin.from('storefront_settings').select('content').eq('key', key).maybeSingle();
        return data?.content;
    } catch (e) {
        return null;
    }
}

export async function updateStorefrontSetting(key: string, content: any) {
    if (!supabaseAdmin) return { success: false, error: "Admin client not configured." };
    
    try {
        const { error } = await supabaseAdmin
            .from('storefront_settings')
            .upsert({ key, content, updated_at: new Date().toISOString() }, { onConflict: 'key' });
            
        if (error) return { success: false, error: error.message };
        
        revalidatePath('/');
        revalidatePath('/admin/featured');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message || "CMS sync failed." };
    }
}

export async function getCategoryCards() {
    return getStorefrontSetting('category_cards');
}

export async function saveCategoryCards(cards: any[]) {
    const indexedCards = cards.map((card, index) => ({
        ...card,
        order: index + 1
    }));
    return updateStorefrontSetting('category_cards', indexedCards);
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
    const data = await getStorefrontSetting('hero_slides');
    return (data as HeroSlide[]) || [];
}

export async function saveHeroSlides(slides: HeroSlide[]) {
    const indexedSlides = slides.map((slide, index) => ({
        ...slide,
        order: index + 1
    }));
    return updateStorefrontSetting('hero_slides', indexedSlides);
}

export async function updateSearchPhrases(phrases: string[]) {
    return updateStorefrontSetting('search_phrases', phrases);
}

export async function toggleReviewVisibility(id: string, isHidden: boolean) {
    if (!supabaseAdmin) return { success: false, error: "Admin client not configured." };
    
    try {
        const { error } = await supabaseAdmin
            .from('reviews')
            .update({ is_hidden: isHidden })
            .eq('id', id);
            
        if (error) return { success: false, error: error.message };
        
        revalidatePath('/');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message || "Toggle failed." };
    }
}

export async function updateReviewOrder(updates: { id: string, sort_order: number }[]) {
    if (!supabaseAdmin) return { success: false, error: "Admin client not configured." };
    try {
        const promises = updates.map(u => 
            supabaseAdmin.from('reviews').update({ sort_order: u.sort_order }).eq('id', u.id)
        );
        await Promise.all(promises);
        revalidatePath('/');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
