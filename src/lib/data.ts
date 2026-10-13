import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';
import { supabase } from './supabase';
import placeholderImages from '@/app/lib/placeholder-images.json';

/**
 * Robust Category Folder Mapper:
 * Maps shorthand folder names found in database paths to the actual 
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
  'roofing': 'Mabati and Roofing',
  'construction': 'Construction and Fencing equip\'nts',
  'collections': 'Collections',
  'decor': 'Collections',
};

/**
 * Master Image URL Resolver:
 * Generates an array of possible URLs for a product.
 * If the primary storage path fails, the frontend will try the next one.
 */
const resolveProductImages = (product: any): string[] => {
  if (!supabase) return ["/placeholder.jpg"];

  // 1. If explicit array exists in database (e.g. from migration or manual edit)
  if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
    return product.imageUrls.map(url => url.startsWith('http') ? url : `/placeholder.jpg`);
  }
  
  if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
    return product.image_urls.map((url: string) => url.startsWith('http') ? url : `/placeholder.jpg`);
  }

  const rawPath = product.image_path?.trim() ?? '';
  const pathsToTry: string[] = [];

  if (rawPath) {
    // A. Clean path: remove "Saved Pictures/" prefix and normalize slashes
    const cleanPath = rawPath.replace(/^Saved Pictures[\\\/]/, '').replace(/\\/g, '/');
    
    // B. Handle Shorthand Mapping (e.g., "solar/panel.jpg" -> "product images/Solar panels & accessories/panel.jpg")
    const pathParts = cleanPath.split('/');
    if (pathParts.length >= 2) {
      const shorthand = pathParts[0].toLowerCase();
      const filename = pathParts.slice(1).join('/');
      
      if (categoryFolderMap[shorthand]) {
        // Most likely path based on your dashboard screenshot
        pathsToTry.push(`product images/${categoryFolderMap[shorthand]}/${filename}`);
      }
    }

    // C. Try standardized variations
    pathsToTry.push(`product images/${cleanPath}`);
    pathsToTry.push(cleanPath);
    pathsToTry.push(rawPath);
  }

  // Generate public URLs for all path variations
  const resolvedUrls = pathsToTry.map(path => {
    if (path.startsWith('http')) return path;
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  });

  // Filter out empty results and return unique set
  const finalUrls = Array.from(new Set(resolvedUrls.filter(Boolean)));
  
  // Return the resolved list or a fallback
  return finalUrls.length > 0 ? finalUrls : ["/placeholder.jpg"];
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
      imageUrls: resolveProductImages(p),
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
