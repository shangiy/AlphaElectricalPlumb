import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';

const STORAGE_BASE_URL = "https://firebasestorage.googleapis.com/v0/b/studio-2955966694-9faa5.firebasestorage.app/o/product%20images%2FDecorative%20Lighting%20and%20chandeliers%2F";
const URL_SUFFIX = "?alt=media";

export const allProductsData: Omit<Product, 'id'>[] = [
  {
    "name": "5-Light Modern Wood Arm Chandelier with Opal Glass Shades",
    "price": 12500,
    "imageUrls": [`${STORAGE_BASE_URL}5-Light%20Modern%20Wood%20Arm%20Chandelier%20with%20Opal%20Glass%20Shades.webp${URL_SUFFIX}`],
    "description": "Elegant 5-light chandelier combining natural wood texture with opal glass shades.",
    "longDescription": "Elevate your living space with this sophisticated 5-light chandelier. Designed with real wood arms and soft opal glass globes, it creates a cozy yet modern atmosphere. Perfect for dining rooms, lounges, or master bedrooms. We handle the delicate transportation and professional installation, ensuring the fixture is securely mounted and balanced for optimal performance. We leave your home only after the unit is fully operational and beautifully lighting your space.",
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
    "longDescription": "A stunning centerpiece for islands or rectangular tables, this molecular chandelier features six hand-blown glass globes. The linear arrangement provides even light distribution, making it ideal for modern kitchens or boardrooms. Our service package includes regional delivery and expert installation by certified electricians. We ensure precise wiring and structural integrity, leaving you with a perfectly functional and breathtaking lighting setup.",
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
    "longDescription": "Command attention with the iconic Sputnik chandelier. Featuring 8 frosted glass shades, this fixture provides brilliant 360-degree illumination suitable for grand entryways or high-ceiling living rooms. The sleek metal arms are adjustable to fit your aesthetic. At Alpha Electricals, we provide safe delivery and professional ceiling installation. Our team will handle the complex assembly and wiring, ensuring your new chandelier is fully working and safely secured before we depart.",
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
      `${STORAGE_BASE_URL}Adjustable%20Cone%20Wall%20Sconce%20with%20Brass%20Swivel%20(3).webp${URL_SUFFIX}`
    ],
    "description": "Versatile wall sconce with a classic cone shape and adjustable brass swivel.",
    "longDescription": "The perfect solution for bedside reading or hallway accents. This sconce features a robust brass swivel that allows for 180-degree rotation, letting you direct light exactly where you need it. The high-quality powder-coated finish ensures it looks great for years to come. We offer express delivery and professional wall-mounting services. Our technicians will ensure a clean, concealed-wire finish, leaving your space looking professional and fully operational.",
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
    "longDescription": "The 2000L Kentank is the gold standard for residential water storage in East Africa. Made from food-grade UV-stabilized material, it resists algae growth and survives the harsh sun. We provide flatbed delivery to your site and expert consultation on base construction. For local orders, we can coordinate with our certified plumbers to handle the connection to your gutter or borehole system, leaving you with a reliable, fully working water solution.",
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
    "longDescription": "Our 20mm PPR pipes are designed for high-pressure durability in both hot and cold water installations. They are corrosion-resistant and lead-free, ensuring safe drinking water for your family. We offer bulk regional delivery for construction projects. Additionally, we provide professional plumbing services to weld and install your system, ensuring a leak-proof and fully working network across your property.",
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
