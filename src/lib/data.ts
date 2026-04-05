import { revalidatePath } from 'next/cache';
export const revalidate = 0;

import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';
import { db } from './firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

// Mock users for the prototype
const MOCK_USERS: MockUser[] = [
  {
    id: 'admin-001',
    name: 'Alpha Admin',
    username: 'alpha_admin',
    email: 'admin@alpha.com',
    password: 'admin12345',
    role: 'admin',
    signedUp: '2024-01-01T10:00:00Z',
    lastSeen: new Date().toISOString(),
    orders: 15,
    visitDuration: 45,
    avatarUrl: '/richard-kinyungu.jpg'
  },
  {
    id: 'user-001',
    name: 'Test User',
    username: 'tester',
    email: 'user@alpha.com',
    password: 'password123',
    role: 'user',
    signedUp: '2024-02-01T12:00:00Z',
    lastSeen: new Date().toISOString(),
    orders: 2,
    visitDuration: 10,
  }
];

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
        image: 'https://firebasestorage.googleapis.com/v0/b/studio-2955966694-9faa5.firebasestorage.app/o/product%20images%2FTanks%20category%2FKentank%20Cylindrical%20Water%20Storage%20Tank%20(Heavy%20Duty).webp?alt=media'
    },
    { 
        id: 'Plumbing', 
        name: 'Plumbing', 
        href: '/plumbing', 
        image: 'https://firebasestorage.googleapis.com/v0/b/studio-2955966694-9faa5.firebasestorage.app/o/product%20images%2FPlumbing%2Fgreen%20PPR%20(Polypropylene%20Random%20Copolymer)%20pipes.webp?alt=media'
    },
    { 
        id: 'Decorative Lighting and chandeliers', 
        name: 'Lighting & Electrical', 
        href: '/lighting', 
        image: 'https://firebasestorage.googleapis.com/v0/b/studio-2955966694-9faa5.firebasestorage.app/o/product%20images%2FDecorative%20Lighting%20and%20chandeliers%2FContemporary%20Gold%20Spiral%20Chandelier.webp?alt=media'
    },
    { 
        id: 'Collections', 
        name: 'Home & Decor', 
        href: '/decor', 
        image: 'https://firebasestorage.googleapis.com/v0/b/studio-2955966694-9faa5.firebasestorage.app/o/product%20images%2FCollections%2FHand-wash%20Basin%20and%20%20Pedestal%20Sink%20Collection.webp?alt=media'
    },
    { 
        id: 'Mabati and Roofing', 
        name: 'Roofing & Construction', 
        href: '/roofing', 
        image: 'https://firebasestorage.googleapis.com/v0/b/studio-2955966694-9faa5.firebasestorage.app/o/product%20images%2FMabati%20and%20Roofing%2FCharcoal%20Black%20Versatile%20Roofing%20Sheets.webp?alt=media'
    },
];

export const availableAvatars: { url: string; alt: string }[] = [
  { url: '/richard-kinyungu.jpg', alt: 'Richard Kinyungu' },
  { url: '/peter-karanja.jpg', alt: 'Peter Karanja' },
  { url: '/miriam-njeri.jpg', alt: 'Miriam Njeri' },
  { url: '/val.jpg', alt: 'Val' },
  { url: '/shangi.jpg', alt: 'Shangi' },
];

export async function getProducts(): Promise<Product[]> {
  if (!db) return [];
  try {
    const productsCol = collection(db, "products");
    const q = query(productsCol, orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Product));
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  return Promise.resolve(categories);
}

export async function getUsers(): Promise<MockUser[]> {
  return Promise.resolve(MOCK_USERS);
}

export async function getUserByEmail(email: string): Promise<MockUser | undefined> {
  return Promise.resolve(MOCK_USERS.find(u => u.email === email));
}

export async function signUpUser(userData: any): Promise<MockUser> {
    const newUser: MockUser = {
        id: `user-${Date.now()}`,
        ...userData,
        role: 'user',
        signedUp: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        orders: 0,
        visitDuration: 0,
    };
    return Promise.resolve(newUser);
}

export async function getTransactions(): Promise<Transaction[]> {
  return Promise.resolve([]);
}