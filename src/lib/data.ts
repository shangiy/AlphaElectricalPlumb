import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';
import { supabase } from './supabase';

/**
 * Robust Path Resolver v6.3.3:
 * Normalizes 'collections/' folder and URL-encodes segments.
 */
function resolveStoragePath(rawPath: string): string {
  if (!rawPath) return '';
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) return rawPath;

  const bucketName = 'product-images';
  let clean = rawPath.replace(/\\/g, '/').replace(/^\/+/, '');
  
  // Remove redundant bucket prefix
  if (clean.startsWith(`${bucketName}/`)) {
    clean = clean.substring(bucketName.length + 1);
  }
  
  // Normalize 'collections' vs 'Collections'
  if (clean.toLowerCase().startsWith('collections/')) {
    clean = 'collections/' + clean.substring(12);
  }

  if (clean && supabase) {
    try {
        const encodedPath = clean.split('/').map(segment => encodeURIComponent(segment)).join('/');
        const { data } = supabase.storage.from(bucketName).getPublicUrl(encodedPath);
        return data.publicUrl;
    } catch (e) {
        console.warn("Storage resolution failed:", clean);
        return rawPath;
    }
  }

  return rawPath;
}

export function getProductImageUrl(product: any): string {
  const rawImage = product?.image_url || product?.image || (product?.image_urls && product.image_urls[0]) || (product?.imageUrls && product.imageUrls[0]);
  if (!rawImage) return '/placeholder.jpg';
  return resolveStoragePath(rawImage);
}

const resolveProductImages = (product: any): string[] => {
  if (!supabase) return ["/placeholder.jpg"];
  const urls: string[] = [];
  const rawArray = product.image_urls || product.imageUrls || product.images || product.gallery;
  if (Array.isArray(rawArray) && rawArray.length > 0) {
    rawArray.forEach((val: any) => {
      if (typeof val === 'string') {
        urls.push(resolveStoragePath(val));
      }
    });
  }
  const singleVal = product.image_url || product.image || product.imageUrl || product.image_path || product.imagePath;
  if (singleVal && typeof singleVal === 'string') {
    urls.push(resolveStoragePath(singleVal));
  }
  const uniqueUrls = Array.from(new Set(urls)).filter(url => url && !url.includes('undefined'));
  return uniqueUrls.length > 0 ? uniqueUrls : ["https://placehold.co/400x400?text=No+Image"];
};

export function mapProduct(p: any): Product {
  if (!p) return {} as Product;
  const generatedSlug = p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || p.id;
  const rawReviews = p.reviews;
  let reviewsList = [];
  let reviewsCount = 0;
  if (Array.isArray(rawReviews)) {
      reviewsList = rawReviews;
      reviewsCount = rawReviews.length;
  } else {
      reviewsCount = Number(rawReviews || 0);
  }
  return {
    id: p.id,
    slug: p.slug || generatedSlug,
    name: p.name || p.title || "Unnamed Product",
    category: p.category || p.cat || p.cat_name || p.category_name || "UNCATEGORIZED",
    description: p.description || p.desc || p.short_description || "",
    longDescription: p.long_description || p.longDescription || p.description || "",
    imageUrls: resolveProductImages(p),
    price: Number(p.price) || 0,
    oldPrice: Number(p.old_price || p.oldPrice) || 0,
    unit: p.unit || "item",
    stockCount: Number(p.stock_count !== undefined ? p.stock_count : (p.stockCount !== undefined ? p.stockCount : 0)),
    rating: Number(p.rating || 5),
    reviews: reviewsCount,
    reviewsList: reviewsList,
    isFeatured: !!(p.is_featured || p.isFeatured),
    featuredOrder: Number(p.featured_order || 0),
    barcode: p.barcode || p.sku || ""
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    if (!supabase) return [];
    const { data, error } = await supabase.from('products').select('*').order('name', { ascending: true });
    if (error) throw error;
    return (data || []).map(mapProduct) as Product[];
  } catch (error) {
    console.error("getProducts failed:", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    if (!supabase) return defaultCategories;
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) {
        const { data: pData } = await supabase.from('products').select('category').not('category', 'is', null);
        const unique = Array.from(new Set((pData || []).map(p => p.category))).map(c => ({ id: c, name: c }));
        return unique.length > 0 ? unique : defaultCategories;
    }
    return (data || []).map(cat => ({ id: String(cat.id), name: cat.name, image_url: cat.image_url, slug: cat.slug }));
  } catch (e) {
    return defaultCategories;
  }
}

const defaultCategories: Category[] = [
    { id: 'Fixtures', name: 'Plumbing Fixtures' },
    { id: 'Bulbs', name: 'Lighting & Bulbs' },
    { id: 'Supplies', name: 'Electrical Supplies' },
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
