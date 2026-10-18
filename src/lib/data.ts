import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';
import { supabase } from './supabase';

/**
 * Image URL Resolver:
 * Supports single strings or JSON arrays of paths.
 * Generates candidate URLs for every path to ensure "Self-Healing"
 * visibility if folders were moved in Supabase.
 */
const resolveProductImages = (product: any): string[] => {
  if (!supabase) return ["/placeholder.jpg"];

  // 1. Get raw paths from database
  const rawPath = product.image_path?.trim() ?? '';
  if (!rawPath) return ["/placeholder.jpg"];

  let basePaths: string[] = [];
  try {
    // Check if the string is a JSON array (e.g. ["img1.webp", "img2.webp"])
    if (rawPath.startsWith('[') && rawPath.endsWith(']')) {
      basePaths = JSON.parse(rawPath);
    } else {
      basePaths = [rawPath];
    }
  } catch (e) {
    basePaths = [rawPath];
  }

  // 2. Generate candidates for EACH base path
  const allCandidates: string[] = [];
  basePaths.forEach(path => {
    const cleanPath = path
      .replace(/^product-images[\\\/]/, '')
      .replace(/^Saved Pictures[\\\/]/, '')
      .replace(/\\/g, '/')
      .replace(/^\/+/, '');

    // Candidate A: Nested folder structure (Found in working links)
    allCandidates.push(supabase.storage.from('product-images').getPublicUrl(`product-images/${cleanPath}`).data.publicUrl);
    
    // Candidate B: Root level bucket access
    allCandidates.push(supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl);
  });

  return allCandidates.length > 0 ? allCandidates : ["/placeholder.jpg"];
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
        image: '' // Resolved in CategoryCard using collections folder
    },
    { 
        id: 'Plumbing', 
        name: 'Plumbing', 
        href: '/plumbing', 
        image: ''
    },
    { 
        id: 'Decorative Lighting and chandeliers', 
        name: 'Lighting & Electrical', 
        href: '/lighting', 
        image: ''
    },
    { 
        id: 'Collections', 
        name: 'Home & Decor', 
        href: '/decor', 
        image: ''
    },
    { 
        id: 'Mabati and Roofing', 
        name: 'Roofing & Construction', 
        href: '/roofing', 
        image: ''
    },
];

export async function getProducts(): Promise<Product[]> {
  try {
    if (!supabase) return [];

    // Filter out invalid/test products requested by the user
    const excludedIds = [
      '06f51dd1-9c33-457a-b06c-af49c1017377', // All-Weather Solar Panel test
      '12f2b128-b21e-4c85-8c9d-2e636bf03719', // Alpha chandelier collection test
      '66b8671c-5d1f-4203-b234-f7b4accc5904'  // Modern Crystal redundant chandelier
    ];

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .not('id', 'in', `(${excludedIds.join(',')})`)
      .order('name', { ascending: true });

    if (error) throw error;

    return (data || []).map(p => ({
      ...p,
      name: p.name || "Unnamed Product",
      category: p.category || "Uncategorized",
      description: p.description || p.longDescription || "",
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
