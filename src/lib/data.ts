import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';
import { supabase } from './supabase';

/**
 * Robust Image URL Resolver:
 * Centralized logic used by all product cards and detail pages.
 * Handles arrays, single strings, and various storage path patterns.
 */
const resolveProductImages = (product: any): string[] => {
  if (!supabase) return ["/placeholder.jpg"];

  const urls: string[] = [];

  // 1. Array check: handle common keys (image_urls, imageUrls, images, gallery)
  const rawArray = product.image_urls || product.imageUrls || product.images || product.gallery;
  if (Array.isArray(rawArray) && rawArray.length > 0) {
    rawArray.forEach((val: any) => {
      if (typeof val === 'string') {
        if (val.startsWith('http')) {
          urls.push(val);
        } else {
          // Resolve relative path from Supabase bucket
          const cleanPath = val.replace(/\\/g, '/').replace(/^\/+/, '');
          urls.push(supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl);
          // Fallback patterns
          urls.push(supabase.storage.from('product-images').getPublicUrl(`product images/${cleanPath}`).data.publicUrl);
          urls.push(supabase.storage.from('product-images').getPublicUrl(`uploads/${cleanPath}`).data.publicUrl);
        }
      }
    });
  }

  // 2. Single string check (image_url, image, imageUrl, image_path)
  const singleVal = product.image_url || product.image || product.imageUrl || product.image_path || product.imagePath;
  if (singleVal && typeof singleVal === 'string') {
    if (singleVal.startsWith('http')) {
      urls.push(singleVal);
    } else {
      const cleanPath = singleVal.replace(/\\/g, '/').replace(/^\/+/, '');
      urls.push(supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl);
      urls.push(supabase.storage.from('product-images').getPublicUrl(`product images/${cleanPath}`).data.publicUrl);
    }
  }

  const uniqueUrls = Array.from(new Set(urls)).filter(url => url && !url.includes('undefined'));
  return uniqueUrls.length > 0 ? uniqueUrls : ["https://placehold.co/400x400?text=No+Image"];
};

/**
 * Fetches the complete catalog from Supabase.
 * Uses a robust mapping to ensure camelCase/snake_case compatibility.
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
        name: p.name || p.title || "Unnamed Product",
        category: p.category || p.cat || "Uncategorized",
        description: p.description || p.desc || p.short_description || "",
        longDescription: p.long_description || p.longDescription || p.description || "",
        imageUrls: resolveProductImages(p),
        price: Number(p.price) || 0,
        oldPrice: Number(p.old_price || p.oldPrice) || 0,
        unit: p.unit || "item",
        stockCount: Number(p.stock_count !== undefined ? p.stock_count : (p.stockCount !== undefined ? p.stockCount : 0)),
        rating: Number(p.rating || 5),
        reviews: Number(p.reviews || 0),
        isFeatured: !!(p.is_featured || p.isFeatured),
        barcode: p.barcode || p.sku || ""
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
