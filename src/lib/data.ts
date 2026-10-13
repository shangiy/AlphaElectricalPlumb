import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';
import { supabase } from './supabase';
import placeholderImages from '@/app/lib/placeholder-images.json';

/**
 * Robust Category Folder Mapper:
 * Maps shorthand folder names often found in database paths to the actual 
 * folder names used in the Supabase Storage bucket.
 */
const categoryFolderMap: Record<string, string> = {
  'solar': 'Solar panels & accessories',
  'tanks': 'Tanks category',
  'lighting': 'Decorative Lighting and chandeliers',
  'electrical': 'Electrical items',
  'plumbing': 'Plumbing',
  'sanitary': 'Sanitary Ware Toilets & Bathroom Fixtures',
  'shower': 'Shower Category',
  'mabati': 'Mabati and Roofing',
  'construction': 'Construction and Fencing equip\'nts',
  'collections': 'Collections',
  'decor': 'Collections', // Mapping decor to Collections based on catalog structure
};

/**
 * Master Image URL Resolver:
 * 1. Strips prefixes like 'Saved Pictures/'.
 * 2. Maps shorthand category folders to full storage folder names.
 * 3. Builds the final URL pointing to the 'product images' folder in the 'product-images' bucket.
 */
const resolveProductImage = (product: any): string[] => {
  if (!supabase) return ["/placeholder.jpg"];

  const rawPath = product.image_path?.trim() ?? '';
  if (!rawPath) {
    if (product.image_url && product.image_url.startsWith('http')) return [product.image_url];
    return ["/placeholder.jpg"];
  }

  // 1. Clean path (remove prefix, handle backslashes)
  let cleanPath = rawPath.replace(/^(Saved Pictures[\\\/])/, '').replace(/\\/g, '/');
  
  // 2. Extract shorthand folder and filename
  const pathParts = cleanPath.split('/');
  if (pathParts.length >= 2) {
    const shorthand = pathParts[0].toLowerCase();
    const filename = pathParts.slice(1).join('/');
    
    // Check if we have a mapping for this shorthand
    if (categoryFolderMap[shorthand]) {
      cleanPath = `${categoryFolderMap[shorthand]}/${filename}`;
    }
  }

  // 3. Try variations (Full Storage Path is the priority)
  const variations = [
    `product images/${cleanPath}`, // Main target: bucket/product images/Full Category Name/file.jpg
    cleanPath,                     // Fallback 1: bucket/Full Category Name/file.jpg
    rawPath                        // Fallback 2: Original database path
  ];

  const urls = variations.map(path => {
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  });

  return urls;
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
