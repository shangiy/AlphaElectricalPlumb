import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';

export const allProductsData: Omit<Product, 'id'>[] = [
  { name: 'Ample Light', price: 2500, images: ['/Ample Light.png'], description: 'A beautiful and bright ample light with several modes.', longDescription: 'A beautiful and bright ample light, perfect for any room in your house.', category: 'lighting-electrical', rating: 4.5, reviews: 10, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: 'ALPHA-ELEC-001', colors: ['White', 'Silver'], isFeatured: true, unit: 'item' },
  { name: 'Artistic Lights', price: 3300, images: ['/exquisite chandelier.jpg'], description: 'Unique and stylish artistic lights.', longDescription: 'A collection of unique and stylish artistic lights to make a statement in any room.', category: 'lighting-electrical', rating: 4.6, reviews: 15, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, isFeatured: true, unit: 'item' },
  { name: 'Electric Cable', price: 30, images: ['/Electric cable per roll.jpg'], unit: 'meter', wholesale: { quantity: 100, price: 3000, unit: 'roll' }, description: 'High-quality electric wiring cable.', longDescription: 'High-quality and durable electric wiring cable, available per meter or in a 100m roll for wholesale pricing.', category: 'lighting-electrical', rating: 4.9, reviews: 50, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, colors: ['Black', 'Red', 'Blue', 'Green'], isFeatured: true },
  { name: 'WarmLight wall bracket', price: 1900, images: ['/WarmLight wall bracket.jpg'], description: 'An elegant warm light wall bracket.', longDescription: 'An elegant warm light wall bracket that provides a cozy and inviting ambiance.', category: 'lighting-electrical', rating: 4.5, reviews: 22, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, colors: ['Silver'], isFeatured: true, unit: 'item' },
  { 
    name: 'Kentank 2000L', 
    price: 15000, 
    images: ['/kentank 2000l.png'], 
    description: 'A best-selling 2000L Kentank, renowned for its superior durability.', 
    longDescription: 'Our most popular 2000L Kentank is the perfect solution for reliable domestic water storage. Manufactured from UV-stabilized, food-grade polyethylene.', 
    category: 'tanks', 
    rating: 4.7, 
    reviews: 45,
    seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, 
    colors: ['Black', 'Green'], 
    unit: 'item' 
  },
  { name: 'Kentank 3000L', price: 10000, images: ['/kentanks 3000L.png'], description: 'A large 3000L Kentank for ample water storage.', longDescription: 'Secure your water supply with the large 3000L Kentank, perfect for bigger households.', category: 'tanks', rating: 4.8, reviews: 30, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, colors: ['Black', 'Green'], unit: 'item' },
  { name: 'Water Tank', price: 6500, images: ['/cuboidTank.PNG'], description: 'A modern, space-saving cuboid water tank.', longDescription: 'This cuboid water tank is the ultimate solution for urban living.', category: 'tanks', rating: 4.5, reviews: 20, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, colors: ['White'], unit: 'item' },
  { name: 'Septic Tank', price: 20000, images: ['/septic Tank.png'], description: 'A highly reliable and robust septic tank.', longDescription: 'Invest in a worry-free wastewater solution with our reliable and robust septic tank.', category: 'tanks', rating: 4.9, reviews: 55, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, colors: ['Black'], unit: 'item' },
  { name: '20mm Bend SWAMI', price: 10, images: ['/20mm Bend SWAMI.png'], description: 'A 20mm pipe bend for plumbing applications.', longDescription: 'A high-quality 20mm pipe bend from SWAMI, designed for durable and leak-proof plumbing connections.', category: 'plumbing', rating: 4.9, reviews: 300, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: '16386', unit: 'item' },
  { name: 'IFLUX WATER HEATER SWITCH Minimalist WHITE 45A', price: 415, oldPrice: 435, images: ['/IFLUXsocket.png'], description: 'A minimalist 45A water heater switch from IFLUX.', longDescription: 'A high-quality and reliable 45A water heater switch from IFLUX.', category: 'lighting-electrical', rating: 4.9, reviews: 180, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: '16496', unit: 'item' },
];
  
export const categories: Category[] = [
    { id: 'tanks', name: 'Tanks' },
    { id: 'plumbing', name: 'Plumbing' },
    { id: 'lighting-electrical', name: 'Lighting & Electrical' },
    { id: 'decor', name: 'Home & Decor' },
    { id: 'roofing', name: 'Roofing & Construction' },
];

export const carouselCategories: CarouselCategory[] = [
    { id: 'tanks', name: 'Tanks', href: '/tanks', image: '/kentank 2000l.png'},
    { id: 'plumbing', name: 'Plumbing', href: '/plumbing', image: '/ppr pipes.png'},
    { id: 'lighting', name: 'Lighting & Electrical', href: '/lighting', image: '/decor lighting design.png'},
    { id: 'decor', name: 'Home & Decor', href: '/decor', image: '/square lights.png'},
    { id: 'roofing', name: 'Roofing & Construction', href: '/roofing', image: '/roof 2.png'},
];

let allUsers: MockUser[] = [
  { id: 'user-1', name: 'Admin User', username: 'admin', email: 'admin@example.com', password: 'adminpassword', role: 'admin', signedUp: '2023-01-15T10:00:00Z', lastSeen: '2023-10-26T12:00:00Z', orders: 15, visitDuration: 25 },
];

let allTransactions: Transaction[] = [
  { id: 'txn-1', customerName: 'Admin User', email: 'admin@example.com', amount: 15000, date: '2023-10-25T14:48:00Z', status: 'Completed', productName: 'Kentank 2000L' },
];

export const availableAvatars: { url: string; alt: string }[] = [
  { url: '/profile-images/richard-kinyungu.jpg', alt: 'Richard Kinyungu' },
  { url: '/profile-images/peter-karanja.jpg', alt: 'Peter Karanja' },
  { url: '/profile-images/miriam-njeri.jpg', alt: 'Miriam Njeri' },
  { url: '/profile-images/val.jpg', alt: 'Val' },
  { url: '/profile-images/shangi.jpg', alt: 'Shangi' },
];

// Utility functions now return mock data directly for speed and reliability in tools.
// Real data fetching is handled by the ProductProvider on the client side.

export async function getProducts(): Promise<Product[]> {
  return allProductsData.map((p, index) => ({
      ...p,
      id: `local-${index}`
  })) as Product[];
}

export async function getCategories(): Promise<Category[]> {
  return Promise.resolve(categories);
}

export async function getUsers(): Promise<MockUser[]> {
  return Promise.resolve(allUsers);
}

export async function getUserByEmail(email: string): Promise<MockUser | undefined> {
  return Promise.resolve(allUsers.find(user => user.email === email));
}

export async function signUpUser(userData: { name: string; username: string; email: string; password?: string, avatarUrl?: string }): Promise<MockUser> {
    const newUser: MockUser = {
        id: `user-${allUsers.length + 1}`,
        ...userData,
        role: 'user',
        signedUp: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        orders: 0,
        visitDuration: 0,
    };
    allUsers.push(newUser);
    return Promise.resolve(newUser);
}

export async function getTransactions(): Promise<Transaction[]> {
  return Promise.resolve(allTransactions);
}
