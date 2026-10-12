
import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';
import { supabase } from './supabase';
import placeholderImages from '@/app/lib/placeholder-images.json';

/**
 * Image URL Transformer:
 * Resolves paths from Supabase Storage and handles local public folder fallbacks.
 */
const resolveProductImage = (p: any): string[] => {
  const images: string[] = [];

  // 1. Resolve image_path from Supabase Storage (Bucket: product-images)
  // Logic: Strip "Saved Pictures/" prefix if present
  const rawPath = p.image_path?.trim() ?? '';
  const cleanPath = rawPath.replace(/^Saved Pictures\//, '');
  
  if (cleanPath && supabase) {
    const { data } = supabase.storage.from('product-images').getPublicUrl(cleanPath);
    if (data?.publicUrl) {
      images.push(data.publicUrl);
    }
  }

  // 2. Add raw imageUrls from the array column if they exist
  if (Array.isArray(p.imageUrls)) {
    p.imageUrls.forEach((url: string) => {
      if (url && !images.includes(url)) {
        // Map local filenames to public folder if they aren't full URLs
        const finalUrl = (url.startsWith('/') || url.startsWith('http')) 
          ? url 
          : `/product-images/${url}`;
        images.push(finalUrl);
      }
    });
  }

  // 3. Fallback to image_url column if provided (legacy support)
  if (p.image_url && !images.includes(p.image_url)) {
    images.push(p.image_url);
  }

  // Final Fallback if no images found
  if (images.length === 0) {
    images.push("https://placehold.co/600x800?text=No+Image");
  }

  return images;
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
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return (data || []).map(p => ({
      ...p,
      imageUrls: resolveProductImage(p)
    })) as Product[];
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
