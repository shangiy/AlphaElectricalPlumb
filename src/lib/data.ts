import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';

const STORAGE_BASE_URL = "https://firebasestorage.googleapis.com/v0/b/studio-2955966694-9faa5.firebasestorage.app/o/product%20images%2FDecorative%20Lighting%20and%20chandeliers%2F";
const URL_SUFFIX = "?alt=media";

export const allProductsData: Omit<Product, 'id'>[] = [
  {
    "name": "5-Light Modern Wood Arm Chandelier with Opal Glass Shades",
    "price": 12500,
    "imageUrls": [`${STORAGE_BASE_URL}5-Light%20Modern%20Wood%20Arm%20Chandelier%20with%20Opal%20Glass%20Shades.webp${URL_SUFFIX}`],
    "description": "Elegant 5-light chandelier combining natural wood texture with opal glass shades.",
    "longDescription": "Bring a touch of organic elegance to your interior with this stunning 5-light chandelier. Featuring real wood arms and soft opal glass globes, it provides a warm, diffused glow perfect for dining areas or master bedrooms. The minimalist yet sturdy construction ensures it complements both Scandinavian and modern styles. At Alpha Electricals, we don't just sell you a light; we ensure it works perfectly. This item includes professional delivery and full installation by our certified technicians, leaving your space beautifully lit and ready to enjoy.",
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
    "longDescription": "A masterpiece of geometric design, this linear chandelier features six hand-blown glass globes arranged in a molecular structure. It is the ideal lighting solution for long surfaces like kitchen islands or conference tables. The sleek metal finish adds a sophisticated industrial edge to any room. We guarantee a stress-free experience with our expert team handling the secure delivery and precise ceiling mounting. We leave only after the system is fully tested and working to your satisfaction.",
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
    "longDescription": "Make a bold architectural statement with our 8-light Sputnik chandelier. Its iconic starburst design and high-quality frosted glass shades provide 360-degree illumination, making it perfect for grand entryways or rooms with high ceilings. The adjustable arms allow you to customize the look to suit your space. Our professional installation service ensures this heavy-duty fixture is balanced and wired correctly for long-term safety. Delivery across Eldoret is included.",
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
    "longDescription": "The ultimate solution for task lighting, this adjustable cone wall sconce features a high-quality solid brass swivel. Whether you need a reading light for your bedside or a stylish accent for a hallway, its 180-degree rotation allows you to point light exactly where it's needed. The durable powder-coated finish ensures longevity and ease of cleaning. We handle the wall mounting and electrical connection to ensure a seamless, wire-free look. Fully installed and ready for use upon delivery.",
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
    "longDescription": "Ensure a consistent water supply with the industry-leading 2000L Kentank. Built from food-grade, UV-stabilized plastic, this tank is designed to withstand the harsh East African climate without degradation. Ideal for residential rainwater harvesting or borehole storage. We provide express delivery and expert advice on base preparation to ensure your tank remains stable and leak-free for decades.",
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
    "longDescription": "Our 20mm PPR pipes are engineered for high-pressure hot and cold water applications. They offer superior resistance to corrosion and scaling, ensuring your water remains clean and your flow remains consistent. Perfect for modern residential plumbing projects. We offer bulk regional delivery and can connect you with certified plumbers for professional installation, ensuring a leak-proof system throughout your property.",
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
