
import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';

const STORAGE_BASE_URL = "https://firebasestorage.googleapis.com/v0/b/studio-2955966694-9faa5.firebasestorage.app/o/product%20images%2FDecorative%20Lighting%20and%20chandeliers%2F";
const URL_SUFFIX = "?alt=media";

export const allProductsData: Omit<Product, 'id'>[] = [
  {
    "name": "5-Light Modern Wood Arm Chandelier with Opal Glass Shades",
    "price": 12500,
    "imageUrls": [`${STORAGE_BASE_URL}5-Light%20Modern%20Wood%20Arm%20Chandelier%20with%20Opal%20Glass%20Shades.webp${URL_SUFFIX}`],
    "description": "Elegant 5-light chandelier combining natural wood texture with opal glass shades.",
    "longDescription": "This chandelier features high-quality wood arms paired with spherical opal glass shades, creating a warm and inviting atmosphere. Ideal for modern living rooms or dining areas. We provide free delivery and professional installation to ensure it is perfectly balanced and fully functional in your home.",
    "category": "lighting-electrical",
    "rating": 4.9,
    "reviews": 12,
    "barcode": "CH-WD-005",
    "colors": ["Oak", "Walnut"],
    "isFeatured": true,
    "unit": "item",
    "seller": { "name": "Alpha Electricals", "id": "alpha-main" }
  },
  {
    "name": "6-Light Linear Molecular Globe Chandelier",
    "price": 15800,
    "imageUrls": [`${STORAGE_BASE_URL}6-Light%20Linear%20Molecular%20Globe%20Chandelier.webp${URL_SUFFIX}`],
    "description": "Contemporary 6-light linear chandelier with a molecular globe design.",
    "longDescription": "A minimalist yet striking lighting fixture with six clear glass globes. The linear arrangement is perfect for kitchen islands or rectangular dining tables. Delivery and expert installation included to guarantee it is safely mounted and fully working upon arrival.",
    "category": "lighting-electrical",
    "rating": 4.8,
    "reviews": 8,
    "barcode": "CH-LN-006",
    "isFeatured": true,
    "unit": "item",
    "seller": { "name": "Alpha Electricals", "id": "alpha-main" }
  },
  {
    "name": "8-Light Modern Sputnik Chandelier with White Frosted Glass Shades",
    "price": 18500,
    "imageUrls": [`${STORAGE_BASE_URL}8-Light%20Modern%20Sputnik%20Chandelier%20with%20White%20Frosted%20Glass%20Shades.webp${URL_SUFFIX}`],
    "description": "Iconic sputnik chandelier with 8 frosted glass shades for superior brightness.",
    "longDescription": "Add a mid-century modern flair to your space with this 8-light sputnik chandelier. The white frosted shades provide a gentle diffusion of light, making it suitable for large spaces. We ensure a hassle-free experience with our dedicated delivery and setup service.",
    "category": "lighting-electrical",
    "rating": 5.0,
    "reviews": 15,
    "barcode": "CH-SP-008",
    "isFeatured": true,
    "unit": "item",
    "seller": { "name": "Alpha Electricals", "id": "alpha-main" }
  },
  {
    "name": "Adjustable Cone Wall Sconce with Brass Swivel",
    "price": 4500,
    "imageUrls": [
      `${STORAGE_BASE_URL}Adjustable%20Cone%20Wall%20Sconce%20with%20Brass%20Swivel.webp${URL_SUFFIX}`,
      `${STORAGE_BASE_URL}Adjustable%20Cone%20Wall%20Sconce%20with%20Brass%20Swivel%20(2).webp${URL_SUFFIX}`,
      `${STORAGE_BASE_URL}Adjustable%20Cone%20Wall%20Sconce%20with%20Brass%20Swivel%20(3).webp${URL_SUFFIX}`,
      `${STORAGE_BASE_URL}Adjustable%20Cone%20Wall%20Sconce%20with%20Brass%20Swivel%20(4).webp${URL_SUFFIX}`
    ],
    "description": "Versatile wall sconce with a classic cone shape and adjustable brass swivel.",
    "longDescription": "This adjustable sconce offers both style and function. The brass swivel allows for precise positioning, making it perfect for focused tasks like reading or highlighting decor. Features a durable powder-coated cone shade. We provide delivery and installation, leaving it ready for use.",
    "category": "lighting-electrical",
    "rating": 4.7,
    "reviews": 24,
    "barcode": "SC-CN-BR",
    "isFeatured": true,
    "unit": "item",
    "seller": { "name": "Alpha Electricals", "id": "alpha-main" }
  },
  {
    "name": "Kentank 2000L",
    "price": 15000,
    "imageUrls": ["https://picsum.photos/seed/tank1/600/600"],
    "description": "High-capacity 2000L water storage tank.",
    "longDescription": "Manufactured from food-grade material, this 2000L Kentank is the industry standard for durability. Perfect for domestic water storage. Delivery available across Eldoret.",
    "category": "tanks",
    "rating": 4.7,
    "reviews": 45,
    "unit": "item",
    "seller": { "name": "Alpha Electricals", "id": "alpha-main" }
  },
  {
    "name": "PPR Pipe 20mm",
    "price": 120,
    "imageUrls": ["https://picsum.photos/seed/pipe1/600/600"],
    "description": "High-quality PPR pipes for hot and cold water systems.",
    "longDescription": "Durable PPR pipes designed for leak-proof connections. Resistant to corrosion and scale build-up. We provide installation services for all plumbing systems.",
    "category": "plumbing",
    "rating": 4.8,
    "reviews": 80,
    "unit": "meter",
    "seller": { "name": "Alpha Electricals", "id": "alpha-main" }
  }
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
  { url: '/richard-kinyungu.jpg', alt: 'Richard Kinyungu' },
  { url: '/peter-karanja.jpg', alt: 'Peter Karanja' },
  { url: '/miriam-njeri.jpg', alt: 'Miriam Njeri' },
  { url: '/val.jpg', alt: 'Val' },
  { url: '/shangi.jpg', alt: 'Shangi' },
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
