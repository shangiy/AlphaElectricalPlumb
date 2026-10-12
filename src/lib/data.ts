
import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';
import { supabase } from './supabase';
import placeholderImages from '@/app/lib/placeholder-images.json';

/**
 * Robust Image URL Resolver:
 * 1. Handles 'Saved Pictures/' prefix removal.
 * 2. Normalizes backslashes to forward slashes.
 * 3. Provides fallbacks for local 'public/product-images/' folder.
 * 4. Generates authenticated-safe public URLs from Supabase Storage.
 */
const resolveProductImage = (p: any): string[] => {
  let images: string[] = [];

  const normalize = (path: string) => {
    if (!path || typeof path !== 'string') return '';
    return path.trim().replace(/\\/g, '/').replace(/^\//, '');
  };

  // 1. Resolve image_path column (Primary Supabase Storage source)
  const rawPath = normalize(p.image_path || p.imagePath || '');
  if (rawPath && supabase) {
    // Try cleaned path (strip 'Saved Pictures/')
    const cleanPath = rawPath.replace(/^Saved Pictures\//i, '');
    const { data: cleanData } = supabase.storage.from('product-images').getPublicUrl(cleanPath);
    if (cleanData?.publicUrl) images.push(cleanData.publicUrl);
    
    // Also try the original path in case the folder was uploaded as 'Saved Pictures'
    if (cleanPath !== rawPath) {
      const { data: origData } = supabase.storage.from('product-images').getPublicUrl(rawPath);
      if (origData?.publicUrl) images.push(origData.publicUrl);
    }
  }

  // 2. Resolve imageUrls array (Handles filenames for local public folder or array of paths)
  const rawUrls = p.imageUrls || p.image_urls || [];
  const urlArray = Array.isArray(rawUrls) ? rawUrls : (typeof rawUrls === 'string' ? [rawUrls] : []);
  
  urlArray.forEach((u: string) => {
    if (!u || typeof u !== 'string') return;
    const norm = normalize(u);
    
    if (norm.startsWith('http')) {
      if (!images.includes(norm)) images.push(norm);
    } else {
      // Case: Just a filename (e.g. "tank.jpg") -> check public/product-images/
      const fileName = norm.split('/').pop();
      const localPath = `/product-images/${fileName}`;
      if (!images.includes(localPath)) images.push(localPath);
      
      // Also try it as a storage path in the bucket
      if (supabase) {
        const { data: storageData } = supabase.storage.from('product-images').getPublicUrl(norm.replace(/^Saved Pictures\//i, ''));
        if (storageData?.publicUrl && !images.includes(storageData.publicUrl)) images.push(storageData.publicUrl);
      }
    }
  });

  // 3. legacy image_url fallback
  if (p.image_url && typeof p.image_url === 'string' && !images.includes(p.image_url)) {
    images.push(p.image_url);
  }

  // Deduplicate and filter empty strings
  images = Array.from(new Set(images.filter(Boolean)));

  // Final Fallback
  if (images.length === 0) {
    images.push("https://placehold.co/600x800?text=Image+Not+Found");
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
      imageUrls: resolveProductImage(p),
      price: Number(p.price) || 0,
      stockCount: Number(p.stock_count || p.stockCount) || 0,
      rating: Number(p.rating) || 5,
      reviews: Number(p.reviews) || 0
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
