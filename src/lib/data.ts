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

  const rawPath = product.image_path?.trim() ?? '';
  if (!rawPath) return ["/placeholder.jpg"];

  let basePaths: string[] = [];
  try {
    // Handle JSON strings (e.g. multi-image arrays)
    // We clean standard JSON artifacts and carriage returns to ensure successful parsing
    if (rawPath.startsWith('[') && rawPath.endsWith(']')) {
      const cleanedJson = rawPath.replace(/[\r\n]/g, '').trim();
      basePaths = JSON.parse(cleanedJson);
    } else {
      basePaths = [rawPath];
    }
  } catch (e) {
    console.warn("Path parsing error for product:", product.id, e);
    basePaths = [rawPath];
  }

  const allCandidates: string[] = [];
  basePaths.forEach(path => {
    if (!path) return;
    
    // Normalize path by stripping redundant bucket or "Saved Pictures" prefixes
    const cleanPath = path
      .replace(/^product-images[\\\/]/i, '')
      .replace(/^Saved Pictures[\\\/]/i, '')
      .replace(/\\/g, '/')
      .replace(/^\/+/, '');

    // Return both possible candidates: with subfolder and root
    // The ProductCard component handles the "Self-Healing" by skipping the broken one
    allCandidates.push(supabase.storage.from('product-images').getPublicUrl(`product-images/${cleanPath}`).data.publicUrl);
    allCandidates.push(supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl);
  });

  const unique = Array.from(new Set(allCandidates));
  return unique.length > 0 ? unique : ["/placeholder.jpg"];
};

export const categories: Category[] = [
    { id: 'Decorative Lighting and chandeliers', name: 'Electricals and Cables' },
    { id: 'Electrical items', name: 'Electrical Items' },
    { id: 'Plumbing', name: 'Plumbing' },
    { id: 'Sanitary Ware Toilets & Bathroom Fixtures', name: 'Toilets & Sinks' },
    { id: 'Shower Category', name: 'Showers' },
    { id: 'Solar panels & accessories', name: 'Solar Solutions' },
    { id: 'Tanks category', name: 'Water Tanks' },
    { id: 'Mabati and Roofing', name: 'Roofing & Mabati' },
    { id: 'Construction and Fencing equip\'nts', name: 'Construction' },
    { id: 'Collections', name: 'Our Collections' },
];

/**
 * Synchronized Carousel Categories: 
 * Every collection card points to a dynamic /category/[slug] route.
 */
export const carouselCategories: CarouselCategory[] = [
    { 
        id: 'Tanks category', 
        name: 'Tanks', 
        href: `/category/tanks`, 
        image: '' 
    },
    { 
        id: 'Plumbing', 
        name: 'Plumbing', 
        href: `/category/plumbing`, 
        image: ''
    },
    { 
        id: 'Decorative Lighting and chandeliers', 
        name: 'Electricals and Cables', 
        href: `/category/lighting`, 
        image: ''
    },
    { 
        id: 'Collections', 
        name: 'Home & Decor', 
        href: `/category/decor`, 
        image: ''
    },
    { 
        id: 'Sanitary Ware Toilets & Bathroom Fixtures', 
        name: 'Toilets & Sinks', 
        href: `/category/toilets`, 
        image: ''
    },
    { 
        id: 'Solar panels & accessories', 
        name: 'Solar category', 
        href: `/category/solar`, 
        image: ''
    },
    { 
        id: 'Mabati and Roofing', 
        name: 'Roofing & Construction', 
        href: `/category/roofing`, 
        image: ''
    },
];

export async function getProducts(): Promise<Product[]> {
  try {
    if (!supabase) return [];

    const excludedIds = [
      '06f51dd1-9c33-457a-b06c-af49c1017377', // Test Musical Chandelier
      '12f2b128-b21e-4c85-8c9d-2e636bf03719', // Old Solar
      '66b8671c-5d1f-4203-b234-f7b4accc5904'  // Dupe Tank
    ];

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return (data || [])
      .filter(p => p && p.id && !excludedIds.includes(p.id))
      .map(p => ({
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
    const { data, error } = await supabase.from('profiles').select('*');
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