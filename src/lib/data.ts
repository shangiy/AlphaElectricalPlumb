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
    if (rawPath.startsWith('[') && rawPath.endsWith(']')) {
      basePaths = JSON.parse(rawPath);
    } else {
      basePaths = [rawPath];
    }
  } catch (e) {
    basePaths = [rawPath];
  }

  const allCandidates: string[] = [];
  basePaths.forEach(path => {
    const cleanPath = path
      .replace(/^product-images[\\\/]/, '')
      .replace(/^Saved Pictures[\\\/]/, '')
      .replace(/\\/g, '/')
      .replace(/^\/+/, '');

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

export const carouselCategories: CarouselCategory[] = [
    { 
        id: 'Tanks category', 
        name: 'Tanks', 
        href: '/search?category=Tanks%20category', 
        image: '' 
    },
    { 
        id: 'Plumbing', 
        name: 'Plumbing', 
        href: '/search?category=Plumbing', 
        image: ''
    },
    { 
        id: 'Decorative Lighting and chandeliers', 
        name: 'Electricals and Cables', 
        href: '/search?category=Decorative%20Lighting%20and%20chandeliers', 
        image: ''
    },
    { 
        id: 'Collections', 
        name: 'Home & Decor', 
        href: '/search?category=Collections', 
        image: ''
    },
    { 
        id: 'Sanitary Ware Toilets & Bathroom Fixtures', 
        name: 'Toilets & Sinks', 
        href: '/search?category=Sanitary%20Ware%20Toilets%20%26%20Bathroom%20Fixtures', 
        image: ''
    },
    { 
        id: 'Solar panels & accessories', 
        name: 'Solar category', 
        href: '/search?category=Solar%20panels%20%26%20accessories', 
        image: ''
    },
    { 
        id: 'Mabati and Roofing', 
        name: 'Roofing & Construction', 
        href: '/search?category=Mabati%20and%20Roofing', 
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
