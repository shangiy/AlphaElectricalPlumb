
import { revalidatePath } from 'next/cache';
export const revalidate = 0;

import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';
import { db } from './firebase';
import { collection, getDocs, query, where, orderBy, setDoc, doc, getDoc } from 'firebase/firestore';
import placeholderImages from '@/app/lib/placeholder-images.json';

// Mock users for the prototype (fallback)
const MOCK_USERS: MockUser[] = [
  {
    id: 'admin-001',
    name: 'Alpha Admin',
    username: 'alpha_admin',
    email: 'admin@alpha.com',
    password: 'passwordadmin',
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
  if (!db) return Promise.resolve(MOCK_USERS);
  try {
    const usersCol = collection(db, "users");
    const snapshot = await getDocs(usersCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MockUser));
  } catch (error) {
    console.error("Error fetching users:", error);
    return Promise.resolve(MOCK_USERS);
  }
}

export async function getUserByEmail(email: string): Promise<MockUser | undefined> {
  if (!db) return Promise.resolve(MOCK_USERS.find(u => u.email === email));
  try {
    const usersCol = collection(db, "users");
    const q = query(usersCol, where("email", "==", email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as MockUser;
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
  }
  return Promise.resolve(MOCK_USERS.find(u => u.email === email));
}

export async function signUpUser(userData: any): Promise<MockUser> {
    const id = userData.uid || `user-${Date.now()}`;
    const newUser: MockUser = {
        id,
        ...userData,
        role: userData.role || 'user',
        signedUp: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        orders: 0,
        visitDuration: 0,
    };
    
    if (db) {
        try {
            await setDoc(doc(db, "users", id), newUser, { merge: true });
        } catch (error) {
            console.error("Error saving user to Firestore:", error);
        }
    }
    
    return newUser;
}

export async function getTransactions(): Promise<Transaction[]> {
  return Promise.resolve([]);
}
