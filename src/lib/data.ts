import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';
import { supabase } from './supabase';
import placeholderImages from '@/app/lib/placeholder-images.json';

/**
 * Image URL Resolver:
 * Matches the exact pattern of the working "Blue Ceramic Squatting Pan" image.
 * DB: "Saved Pictures/category/filename.webp"
 * Storage: bucket "product-images" -> folder "product-images" -> "category" -> "filename.webp"
 */
const resolveProductImages = (product: any): string[] => {
  if (!supabase) return ["/placeholder.jpg"];

  // 1. If there's already a full URL array, use it
  const explicitUrls = product.image_urls || product.imageUrls;
  if (Array.isArray(explicitUrls) && explicitUrls.length > 0) {
    return explicitUrls.map((url: string) => url.startsWith('http') ? url : "/placeholder.jpg");
  }

  // 2. Process the image_path column
  const rawPath = product.image_path?.trim() ?? '';
  if (!rawPath) return ["/placeholder.jpg"];

  // Step A: Strip "Saved Pictures/" and "product-images/" if they exist at the start
  const relativePath = rawPath
    .replace(/^Saved Pictures[\\\/]/, '')
    .replace(/^product-images[\\\/]/, '')
    .replace(/\\/g, '/')
    .replace(/^\/+/, ''); // Strip any leading slashes

  // Step B: Build the specific nested path revealed in the working URL
  // Working URL: .../public/product-images/product-images/toilets%20&%20sinks/...
  const nestedPath = `product-images/${relativePath}`;

  const { data } = supabase.storage.from('product-images').getPublicUrl(nestedPath);
  
  return [data.publicUrl];
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
      reviews: Number(p.reviews || 0),
      longDescription: p.longDescription || p.description || ""
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

export const availableAvatars = [
    { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', alt: 'Avatar 1' },
    { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', alt: 'Avatar 2' },
    { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo', alt: 'Avatar 3' },
    { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casper', alt: 'Avatar 4' },
];
