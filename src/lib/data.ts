import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';
import { supabase } from './supabase';

/**
 * Robust Image URL Resolver:
 * Centralized logic used by all product cards and detail pages.
 * Handles arrays, single strings, and legacy storage paths.
 */
const resolveProductImages = (product: any): string[] => {
  if (!supabase) return ["/placeholder.jpg"];

  const urls: string[] = [];

  // 1. Array check: if it's already a full Supabase link array, use it.
  if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
    product.image_urls.forEach((url: any) => {
      if (typeof url === 'string' && url.startsWith('http')) urls.push(url);
    });
  }

  // 2. Single URL check (image_url, image, or imageUrl columns)
  const singleUrl = product.image_url || product.image || product.imageUrl;
  if (singleUrl && typeof singleUrl === 'string' && singleUrl.startsWith('http')) {
    urls.push(singleUrl);
  }

  if (urls.length > 0) return Array.from(new Set(urls));

  // 3. Path-based resolution for legacy catalog or relative paths
  const rawPath = (product.image_path || product.image || '').toString().trim();
  if (!rawPath || rawPath.startsWith('http')) {
      return urls.length > 0 ? urls : ["https://placehold.co/400x400?text=No+Image"];
  }

  let basePaths: string[] = [];
  
  if (rawPath.startsWith('[') && rawPath.endsWith(']')) {
    try {
      basePaths = JSON.parse(rawPath.replace(/[\r\n]/g, '').trim());
    } catch (e) {
      basePaths = rawPath.slice(1, -1).split(',').map((p: string) => p.trim()).filter(Boolean);
    }
  } else {
    basePaths = [rawPath];
  }

  basePaths.forEach(path => {
    const cleanPath = path
      .replace(/[\[\]]/g, '')
      .replace(/^(product-images\/)+/i, '')
      .replace(/^(product images\/)+/i, '')
      .replace(/\\/g, '/')
      .replace(/^\/+/, '');

    // Check common Supabase folder patterns
    urls.push(supabase.storage.from('product-images').getPublicUrl(`product images/${cleanPath}`).data.publicUrl);
    urls.push(supabase.storage.from('product-images').getPublicUrl(`product-images/${cleanPath}`).data.publicUrl);
    urls.push(supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl);
    urls.push(supabase.storage.from('product-images').getPublicUrl(`uploads/${cleanPath}`).data.publicUrl);
  });

  return Array.from(new Set(urls));
};

/**
 * Fetches the complete catalog from Supabase.
 * This is the single source of truth for both Studio and Vercel.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return (data || [])
      .map(p => ({
        id: p.id,
        name: p.name || "Unnamed Product",
        category: p.category || "Uncategorized",
        description: p.description || p.long_description || "",
        longDescription: p.long_description || p.description || "",
        imageUrls: resolveProductImages(p),
        price: Number(p.price) || 0,
        oldPrice: Number(p.old_price) || 0,
        unit: p.unit || "item",
        stockCount: Number(p.stock_count || 0),
        rating: Number(p.rating || 5),
        reviews: Number(p.reviews || 0),
        isFeatured: !!p.is_featured,
        barcode: p.barcode || ""
      })) as Product[];
  } catch (error) {
    console.error("Supabase Sync Error:", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    if (!supabase) return defaultCategories;
    const { data, error } = await supabase.from('products').select('category').not('category', 'is', null);
    if (error) throw error;
    
    const unique = Array.from(new Set(data.map(p => p.category))).map(c => ({ id: c, name: c }));
    return unique.length > 0 ? unique : defaultCategories;
  } catch (e) {
    return defaultCategories;
  }
}

const defaultCategories: Category[] = [
    { id: 'Tanks', name: 'Water Tanks' },
    { id: 'Plumbing', name: 'Plumbing' },
    { id: 'Electricals', name: 'Electricals' },
];

export const carouselCategories: CarouselCategory[] = [
    { id: 'Tanks', name: 'Tanks', href: `/category/tanks`, image: '' },
    { id: 'Plumbing', name: 'Plumbing', href: `/category/plumbing`, image: ''},
    { id: 'Electricals', name: 'Electricals', href: `/category/lighting`, image: ''},
    { id: 'Decor', name: 'Home & Decor', href: `/category/decor`, image: ''},
];

export async function getUsers(): Promise<MockUser[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('profiles').select('*');
  return (data || []) as any[];
}

export async function getTransactions(): Promise<Transaction[]> {
  return [];
}

export const availableAvatars = [
    { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', alt: 'Avatar 1' },
    { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', alt: 'Avatar 2' },
    { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alpha', alt: 'Avatar 3' },
    { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Staff', alt: 'Avatar 4' },
];
