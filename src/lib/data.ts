
import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';
import { supabase } from './supabase';
import placeholderImages from '@/app/lib/placeholder-images.json';

/**
 * Image URL Transformer:
 * This helper ensures that if an image is meant to be stored in the public folder,
 * it maps correctly. It also handles legacy Firebase URLs by defaulting to a placeholder
 * if the Firebase site is down.
 */
const transformImageUrl = (url: string) => {
  if (!url) return "https://placehold.co/600x800?text=No+Image";
  
  // If the image is a local path or already a valid external URL, return it
  if (url.startsWith('/') || url.startsWith('http')) {
    return url;
  }
  
  // Assume it's a file name in your public/product-images folder
  return `/product-images/${url}`;
};

export const categories: Category[] = [
    { id: 'Decorative Lighting and chandeliers', name: 'Lighting & Chandeliers' },
    { id: 'Electrical items', name: 'Electrical Items' },
    { id: 'Plumbing', name: 'Plumbing' },
    { id: 'Sanitary Ware Toilets & Bathroom Fixtures', name: 'Sanitary & Bathroom' },
    { id: 'Shower Category', name: 'Showers' },
    { id: 'Solar panels & accessories', name: 'Solar Solutions' },
    { id: 'Tanks category', name: 'Water Tanks' },
    { id: 'Mabati and Roofing', name: 'Roofing & Mabati' },
    { id: 'Construction and Fencing equip\'nts', name: 'Construction' },
    { id: 'Collections', name: 'Our Collections' },
];

export const carouselCategories: CarouselCategory[] = [
    { 
        id: 'Tanks category', 
        name: 'Tanks', 
        href: '/tanks', 
        image: placeholderImages.cat_tanks.url
    },
    { 
        id: 'Plumbing', 
        name: 'Plumbing', 
        href: '/plumbing', 
        image: placeholderImages.cat_plumbing.url
    },
    { 
        id: 'Decorative Lighting and chandeliers', 
        name: 'Lighting & Electrical', 
        href: '/lighting', 
        image: placeholderImages.cat_lighting.url
    },
    { 
        id: 'Collections', 
        name: 'Home & Decor', 
        href: '/decor', 
        image: placeholderImages.cat_decor.url
    },
    { 
        id: 'Mabati and Roofing', 
        name: 'Roofing & Construction', 
        href: '/roofing', 
        image: placeholderImages.cat_roofing.url
    },
];

export async function getProducts(): Promise<Product[]> {
  try {
    // Graceful fallback if Supabase is not configured
    if (!supabase) {
      console.warn("getProducts: Supabase client is null. Returning empty catalog.");
      return [];
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return (data || []).map(p => {
      // 1. Resolve image_path from Supabase Storage
      const rawPath = p.image_path?.trim() ?? '';
      const cleanPath = rawPath.replace(/^Saved Pictures\//, '');
      
      let storageUrl = null;
      if (cleanPath && supabase) {
        storageUrl = supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl;
      }

      // 2. Resolve other URLs (public/product-images or external)
      const otherUrls = (p.imageUrls || []).map(transformImageUrl);

      // Prioritize the Storage URL (image_path) if available
      const finalUrls = storageUrl ? [storageUrl, ...otherUrls] : (otherUrls.length > 0 ? otherUrls : ["/placeholder.jpg"]);

      return {
        ...p,
        imageUrls: finalUrls
      };
    }) as Product[];
  } catch (error) {
    console.error("Error fetching products from Supabase:", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  return Promise.resolve(categories);
}

export async function getUsers(): Promise<MockUser[]> {
  try {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) throw error;
    return data as any[];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  return Promise.resolve([]);
}
