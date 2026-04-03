
import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';

const STORAGE_BASE_URL = "https://firebasestorage.googleapis.com/v0/b/studio-2955966694-9faa5.firebasestorage.app/o/product%20images%2FDecorative%20Lighting%20and%20chandeliers%2F";
const URL_SUFFIX = "?alt=media";

export const allProductsData: Omit<Product, 'id'>[] = [
  {
    "name": "5-Light Modern Wood Arm Chandelier with Opal Glass Shades",
    "price": 12500,
    "imageUrls": [`${STORAGE_BASE_URL}5-Light%20Modern%20Wood%20Arm%20Chandelier%20with%20Opal%20Glass%20Shades.webp${URL_SUFFIX}`],
    "description": "Elegant 5-light chandelier combining natural wood texture with opal glass shades.",
    "longDescription": "This exquisite 5-light chandelier combines the warmth of natural wood arms with the sophisticated elegance of opal glass shades. Perfectly designed for modern living rooms or dining areas, it provides a soft, diffused glow that creates a welcoming atmosphere. The high-quality wood finish adds an organic touch to contemporary interiors. We provide free delivery within Eldoret and professional installation to ensure the fixture is perfectly balanced and fully functional in your home.",
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
    "longDescription": "A striking piece of contemporary art for your ceiling, this 6-light linear chandelier features clear glass globes in a striking molecular arrangement. The linear design makes it an ideal choice for placement over kitchen islands, long dining tables, or in hallways. It offers clear, bright illumination while maintaining a minimalist aesthetic. Our dedicated team handles the entire delivery and setup process, ensuring the molecular structure is securely mounted and perfectly aligned.",
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
    "longDescription": "Add a bold mid-century modern statement to your large rooms with this 8-light sputnik chandelier. The white frosted shades diffuse light evenly across the room, eliminating harsh glares while providing superior brightness. Its iconic starburst design serves as a focal point in any grand entryway or high-ceiling living space. We include professional delivery and expert installation service to guarantee a safe and flawless setup.",
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
    "longDescription": "Versatile and stylish, this adjustable cone wall sconce is the perfect solution for focused task lighting. The beautiful brass swivel allows for precise positioning, making it an excellent choice for bedside reading, over a desk, or as an accent light to highlight wall decor. It features a durable powder-coated finish and multiple orientation options to fit your unique space. We provide professional installation to ensure the wiring is hidden and the sconce is ready for immediate use.",
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
    "longDescription": "Manufactured from food-grade material, this 2000L Kentank is the industry standard for durability and safety. Perfect for domestic water storage, it features a heavy-duty design that withstands the elements. We provide fast delivery across the region and offer expert advice on proper placement and base preparation to ensure long-term reliability.",
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
    "longDescription": "Durable PPR pipes designed for leak-proof connections in both residential and industrial plumbing. These pipes are highly resistant to corrosion, scale build-up, and high temperatures. We offer bulk delivery and professional plumbing installation services to guarantee a reliable water system for your property.",
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
