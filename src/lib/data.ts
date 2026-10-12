
import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';
import { supabase } from './supabase';
import placeholderImages from '@/app/lib/placeholder-images.json';

/**
 * Robust Image URL Resolver:
 * This function handles the specific "Saved Pictures/" prefix found in your Supabase DB.
 * It generates URLs for both the stripped path and the full path to ensure coverage.
 */
const resolveProductImage = (p: any): string[] => {
  const images: string[] = [];

  const normalize = (path: string) => {
    if (!path || typeof path !== 'string') return '';
    return path.trim().replace(/\\/g, '/').replace(/^\//, '');
  };

  // 1. Resolve from image_path column (Main Supabase Source)
  const rawPath = normalize(p.image_path || '');
  if (rawPath && supabase) {
    const bucket = 'product-images';
    
    // Variation A: Strip 'Saved Pictures/' (e.g. "solar/panel.jpg")
    const cleanPath = rawPath.replace(/^Saved Pictures\//i, '');
    const { data: cleanUrl } = supabase.storage.from(bucket).getPublicUrl(cleanPath);
    if (cleanUrl?.publicUrl) images.push(cleanUrl.publicUrl);

    // Variation B: Keep full path (e.g. "Saved Pictures/solar/panel.jpg")
    const { data: fullUrl } = supabase.storage.from(bucket).getPublicUrl(rawPath);
    if (fullUrl?.publicUrl && !images.includes(fullUrl.publicUrl)) images.push(fullUrl.publicUrl);
    
    // Variation C: Local Public Folder Fallback
    const fileName = cleanPath.split('/').pop();
    if (fileName) images.push(`/product-images/${fileName}`);
  }

  // 2. Resolve from imageUrls/image_urls array
  const rawUrls = p.imageUrls || p.image_urls || [];
  const urlArray = Array.isArray(rawUrls) ? rawUrls : (typeof rawUrls === 'string' ? [rawUrls] : []);
  
  urlArray.forEach((u: string) => {
    if (!u) return;
    const norm = normalize(u);
    if (norm.startsWith('http')) {
      if (!images.includes(norm)) images.push(norm);
    } else {
      const fileName = norm.split('/').pop();
      images.push(`/product-images/${fileName}`);
    }
  });

  // 3. Resolve from legacy image_url column
  if (p.image_url && typeof p.image_url === 'string' && !images.includes(p.image_url)) {
    images.push(p.image_url);
  }

  // Deduplicate and filter empty strings
  const finalImages = Array.from(new Set(images.filter(Boolean)));

  // Global Fallback
  if (finalImages.length === 0) {
    finalImages.push("https://placehold.co/600x800?text=Image+Not+Found");
  }

  return finalImages;
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
      stockCount: Number(p.stock_count || p.stockCount || 0),
      rating: Number(p.rating || 5),
      reviews: Number(p.reviews || 0)
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
