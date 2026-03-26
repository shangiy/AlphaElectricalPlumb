import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';

export const allProductsData: Omit<Product, 'id'>[] = [
  // Lighting & Electrical
  { name: 'Ample Light', price: 2500, images: ['/Ample Light.png'], description: 'A beautiful and bright ample light with several modes.', longDescription: 'A beautiful and bright ample light, perfect for any room in your house.', category: 'lighting-electrical', rating: 4.5, reviews: 10, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: 'ALPHA-ELEC-001', colors: ['White', 'Silver'], isFeatured: true, unit: 'item' },
  { name: 'Artistic Lights', price: 3300, images: ['/exquisite chandelier.jpg'], description: 'Unique and stylish artistic lights.', longDescription: 'A collection of unique and stylish artistic lights to make a statement in any room.', category: 'lighting-electrical', rating: 4.6, reviews: 15, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, isFeatured: true, unit: 'item' },
  { name: 'Electric Cable', price: 30, images: ['/Electric cable per roll.jpg'], unit: 'meter', wholesale: { quantity: 100, price: 3000, unit: 'roll' }, description: 'High-quality electric wiring cable.', longDescription: 'High-quality and durable electric wiring cable, available per meter or in a 100m roll for wholesale pricing.', category: 'lighting-electrical', rating: 4.9, reviews: 50, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, colors: ['Black', 'Red', 'Blue', 'Green'], isFeatured: true },
  { name: 'WarmLight wall bracket', price: 1900, images: ['/WarmLight wall bracket.jpg'], description: 'An elegant warm light wall bracket.', longDescription: 'An elegant warm light wall bracket that provides a cozy and inviting ambiance.', category: 'lighting-electrical', rating: 4.5, reviews: 22, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, colors: ['Silver'], isFeatured: true, unit: 'item' },
  { name: '2 Pin Connectors Optonica PETOM', price: 150, images: ['/2 Pin Connectors Optonica PETOM.png'], description: 'Reliable 2-pin connectors for electrical setups.', longDescription: 'High-quality Optonica PETOM 2-pin connectors designed for secure and durable electrical connections.', category: 'lighting-electrical', rating: 4.4, reviews: 12, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: '2FT Vellmax Flat Tube 25W', price: 850, images: ['/2FT vellmax Flat Tube 25w.png'], description: 'Bright and energy-efficient 25W flat LED tube.', longDescription: 'The Vellmax 2FT flat tube offers 25W of powerful illumination with low energy consumption, perfect for office or home use.', category: 'lighting-electrical', rating: 4.7, reviews: 34, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: '3 GANG IFLUX FLOUR SERIES', price: 1200, images: ['/3 GANG IFLUX  FLOUR SERIES SWH3G2-14.jpg'], description: 'Modern 3-gang switch from the IFLUX Flour series.', longDescription: 'A sleek and durable 3-gang electrical switch, part of the premium IFLUX Flour series, designed for contemporary interiors.', category: 'lighting-electrical', rating: 4.8, reviews: 18, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: '3 in 1 Lights', price: 4500, images: ['/3 in 1 lights.png'], description: 'Versatile 3-in-1 LED lighting fixture.', longDescription: 'Experience multiple lighting modes in one fixture with our 3-in-1 LED lights, adjustable for different moods.', category: 'lighting-electrical', rating: 4.6, reviews: 25, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: '20W Vellmax Floodlight', price: 2200, images: ['/20w-vellmax-floodlight.png'], description: 'Powerful 20W outdoor floodlight.', longDescription: 'Keep your premises secure and bright with this 20W Vellmax floodlight, built to withstand outdoor elements.', category: 'lighting-electrical', rating: 4.9, reviews: 42, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'IFLUX WATER HEATER SWITCH', price: 415, oldPrice: 435, images: ['/IFLUXsocket.png'], description: 'Minimalist 45A water heater switch.', longDescription: 'A high-quality and reliable 45A water heater switch from IFLUX, featuring a clean minimalist design.', category: 'lighting-electrical', rating: 4.9, reviews: 180, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: '16496', unit: 'item' },

  // Tanks
  { name: 'Kentank 2000L', price: 15000, images: ['/kentank 2000l.png'], description: 'Best-selling 2000L water tank.', longDescription: 'Our most popular 2000L Kentank is the perfect solution for reliable domestic water storage. Manufactured from UV-stabilized polyethylene.', category: 'tanks', rating: 4.7, reviews: 45, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, colors: ['Black', 'Green'], unit: 'item' },
  { name: 'Kentank 3000L', price: 10000, images: ['/kentanks 3000L.png'], description: 'Large 3000L Kentank for ample storage.', longDescription: 'Secure your water supply with the large 3000L Kentank, perfect for bigger households or small businesses.', category: 'tanks', rating: 4.8, reviews: 30, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, colors: ['Black', 'Green'], unit: 'item' },
  { name: 'Water Tank (Cuboid)', price: 6500, images: ['/cuboidTank.PNG'], description: 'Modern, space-saving cuboid water tank.', longDescription: 'This cuboid water tank is the ultimate solution for urban living, fitting into tight spaces efficiently.', category: 'tanks', rating: 4.5, reviews: 20, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, colors: ['White'], unit: 'item' },
  { name: 'Septic Tank', price: 20000, images: ['/septic Tank.png'], description: 'Highly reliable and robust septic tank.', longDescription: 'Invest in a worry-free wastewater solution with our reliable and robust septic tank, designed for long-term underground use.', category: 'tanks', rating: 4.9, reviews: 55, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, colors: ['Black'], unit: 'item' },

  // Plumbing
  { name: '20mm Bend SWAMI', price: 10, images: ['/20mm Bend SWAMI.png'], description: '20mm pipe bend for plumbing applications.', longDescription: 'A high-quality 20mm pipe bend from SWAMI, designed for durable and leak-proof plumbing connections.', category: 'plumbing', rating: 4.9, reviews: 300, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: '16386', unit: 'item' },
  { name: '4L-22934-LS Union', price: 450, images: ['/4L-22934-LS union.png'], description: 'Durable plumbing union for pipe connections.', longDescription: 'The 4L-22934-LS union provides a secure, detachable connection between two pipes, essential for maintenance access.', category: 'plumbing', rating: 4.3, reviews: 8, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: '4FT Earthrod', price: 1800, images: ['/4FT EARTHROD.jpg'], description: 'Heavy-duty 4ft earth rod for grounding.', longDescription: 'Essential for electrical safety, this 4ft earth rod provides a reliable path to ground for electrical systems.', category: 'plumbing', rating: 4.7, reviews: 15, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },

  // Decor & Home
  { name: '2L Classic Water Bottle', price: 1200, images: ['/2L Classic water bottle.png'], description: 'Large 2L water bottle for daily hydration.', longDescription: 'Stay hydrated all day with our classic 2L water bottle, featuring a durable design and easy-carry handle.', category: 'decor', rating: 4.5, reviews: 60, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: '5 Lamp Chandelier General', price: 18500, images: ['/5 Lamp Chandelier General.png'], description: 'Exquisite 5-lamp chandelier for elegant rooms.', longDescription: 'Transform your living or dining area with this stunning 5-lamp chandelier, combining classic style with modern brilliance.', category: 'decor', rating: 4.9, reviews: 12, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: '32 Piece Dinner Set', price: 12500, images: ['/32 piece dinner set collection.png'], description: 'Comprehensive 32-piece ceramic dinner set.', longDescription: 'Perfect for hosting, this 32-piece dinner set includes everything you need for a full course meal for the whole family.', category: 'decor', rating: 4.8, reviews: 28, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: '3w WarmWhite FAME Pendant', price: 3500, images: ['/3w WarmWhite FAME V-LIKE shaped HOME PENDANT.png'], description: 'V-shaped WarmWhite pendant light.', longDescription: 'Add a touch of modern art to your ceiling with the FAME V-shaped pendant light, emitting a warm, welcoming glow.', category: 'decor', rating: 4.7, reviews: 9, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
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
