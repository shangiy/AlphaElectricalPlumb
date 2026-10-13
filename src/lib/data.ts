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
  'decor': 'Collections',
};

/**
 * Master Image URL Resolver:
 * Generates a list of possible URLs for a product to ensure we find the image
 * regardless of slight path differences in the bucket.
 */
const resolveProductImages = (product: any): string[] => {
  if (!supabase) return ["/placeholder.jpg"];

  // 1. Start with existing imageUrls array if provided by migration script
  if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
    return product.imageUrls.map(url => url.startsWith('http') ? url : `/placeholder.jpg`);
  }

  const rawPath = product.image_path?.trim() ?? '';
  const fallbackUrl = product.image_url?.trim() ?? '';
  
  const pathsToTry: string[] = [];

  if (rawPath) {
    // Clean path (remove prefix, handle backslashes)
    let cleanPath = rawPath.replace(/^(Saved Pictures[\\\/])/, '').replace(/\\/g, '/');
    
    const parts = cleanPath.split('/');
    if (parts.length >= 2) {
      const shorthand = parts[0].toLowerCase();
      const filename = parts.slice(1).join('/');
      
      // If we have a mapping for this shorthand, try the full category path
      if (categoryFolderMap[shorthand]) {
        pathsToTry.push(`product images/${categoryFolderMap[shorthand]}/${filename}`);
      }
    }

    // Standard variations based on user bucket structure
    pathsToTry.push(`product images/${cleanPath}`);
    pathsToTry.push(cleanPath);
    pathsToTry.push(rawPath);
  }

  if (fallbackUrl) {
    pathsToTry.push(fallbackUrl);
  }

  // Generate public URLs from Supabase for all paths
  const resolvedUrls = pathsToTry.map(path => {
    if (path.startsWith('http')) return path;
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  });

  // Filter out empty results and return unique set
  const finalUrls = Array.from(new Set(resolvedUrls.filter(Boolean)));
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
