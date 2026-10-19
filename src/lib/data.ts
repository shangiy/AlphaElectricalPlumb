import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';
import { supabase } from './supabase';

/**
 * Robust Image URL Resolver:
 * Now supports hybrid inputs: full URLs (for new Supabase uploads) and paths (for legacy catalog).
 * Handles strict JSON arrays, single strings, and malformed "pseudo-arrays" [path1, path2].
 * Fixed to skip "poisoned" URLs that include encoded brackets.
 */
const resolveProductImages = (product: any): string[] => {
  if (!supabase) return ["/placeholder.jpg"];

  // 1. Specific Prototype Overrides for premium items
  const PRODUCT_OVERRIDES: Record<string, string[]> = {
    '00bb9955-c08d-4688-b3fb-db00637459c6': [
      'frosted glass globe shade on a polished chrome curved arm withwooden mounting base (2).webp',
      'frosted glass globe shade on a polished chrome curved arm withwooden mounting base.webp'
    ]
  };

  if (PRODUCT_OVERRIDES[product.id]) {
    return PRODUCT_OVERRIDES[product.id].map(path => {
        const clean = path.replace(/\\/g, '/').replace(/^\/+/, '');
        // Try multiple folder candidates for the override images
        return supabase.storage.from('product-images').getPublicUrl(`product images/${clean}`).data.publicUrl;
    });
  }

  // 2. Initial URL check - Filter out "poisoned" URLs (encoded brackets)
  if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
      const firstUrl = product.imageUrls[0];
      if (firstUrl.startsWith('http') && !firstUrl.includes('%5B') && !firstUrl.includes('%5D')) {
          return product.imageUrls;
      }
  }

  const rawPath = (product.image_path || '').trim();
  
  // 3. If no valid image_path or existing URLs, try to reconstruct from relative paths
  if (!rawPath) {
      if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
          return product.imageUrls.map((path: string) => {
              if (path.startsWith('http')) return path;
              const clean = path.replace(/\\/g, '/').replace(/^\/+/, '');
              return supabase.storage.from('product-images').getPublicUrl(clean).data.publicUrl;
          });
      }
      return ["/placeholder.jpg"];
  }

  let basePaths: string[] = [];
  
  // 4. Robust Array Parsing for [path1, path2]
  if (rawPath.startsWith('[') && rawPath.endsWith(']')) {
    try {
      // Try strict JSON parse first
      const cleanedJson = rawPath.replace(/[\r\n]/g, '').trim();
      basePaths = JSON.parse(cleanedJson);
    } catch (e) {
      // Manual fallback for malformed pseudo-arrays like [path1, path2]
      const inner = rawPath.slice(1, -1);
      basePaths = inner.split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0 && p !== '[' && p !== ']');
    }
  } else {
    basePaths = [rawPath];
  }

  const allCandidates: string[] = [];
  basePaths.forEach(path => {
    if (!path || path === '[' || path === ']') return;
    
    // Clean path of encoded or literal brackets
    const cleanPath = path
      .replace(/[\[\]]/g, '')
      .replace(/^(product-images\/)+/i, '')
      .replace(/^(Saved Pictures\/)+/i, '')
      .replace(/\\/g, '/')
      .replace(/^\/+/, '');

    // Return multiple candidates to ensure "Self-Healing"
    // Including "product images/" with space as requested
    allCandidates.push(supabase.storage.from('product-images').getPublicUrl(`product images/${cleanPath}`).data.publicUrl);
    allCandidates.push(supabase.storage.from('product-images').getPublicUrl(`product-images/${cleanPath}`).data.publicUrl);
    allCandidates.push(supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl);
    allCandidates.push(supabase.storage.from('product-images').getPublicUrl(`uploads/${cleanPath}`).data.publicUrl);
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
    { id: 'Tanks category', name: 'Tanks', href: `/category/tanks`, image: '' },
    { id: 'Plumbing', name: 'Plumbing', href: `/category/plumbing`, image: ''},
    { id: 'Decorative Lighting and chandeliers', name: 'Electricals and Cables', href: `/category/lighting`, image: ''},
    { id: 'Collections', name: 'Home & Decor', href: `/category/decor`, image: ''},
    { id: 'Sanitary Ware Toilets & Bathroom Fixtures', name: 'Toilets & Sinks', href: `/category/toilets`, image: ''},
    { id: 'Solar panels & accessories', name: 'Solar category', href: `/category/solar`, image: ''},
    { id: 'Mabati and Roofing', name: 'Roofing & Construction', href: `/category/roofing`, image: ''},
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
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Dynamic Categories Fetcher:
 * Gets unique categories from the database and merges them with defaults.
 */
export async function getCategories(): Promise<Category[]> {
  try {
    if (!supabase) return categories;

    const { data, error } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null);

    if (error) throw error;

    const uniqueDbCategories = Array.from(new Set(data.map(p => p.category)))
      .filter(Boolean)
      .map(cat => ({ id: cat, name: cat }));

    const merged = [...categories];
    uniqueDbCategories.forEach(dbCat => {
        if (!merged.find(m => m.name === dbCat.name)) {
            merged.push(dbCat);
        }
    });

    return merged;
  } catch (e) {
    return categories;
  }
}

export async function getUsers(): Promise<MockUser[]> {
  try {
    if (!supabase) return [];
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) throw error;
    return data as any[];
  } catch (error) {
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
