import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';

const generateProducts = (): Omit<Product, 'id'>[] => {
  const products: Omit<Product, 'id'>[] = [
    // --- LIGHTING & ELECTRICAL (Approx 25 items) ---
    { name: 'Ample Light', price: 2500, images: ['/Ample Light.png'], description: 'Bright ample light with multiple modes.', longDescription: 'Professional grade lighting for modern homes.', category: 'lighting-electrical', rating: 4.5, reviews: 10, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: 'ALPHA-ELEC-001', isFeatured: true, unit: 'item' },
    { name: 'Artistic Lights', price: 3300, images: ['/exquisite chandelier.jpg'], description: 'Unique and stylish artistic lights.', longDescription: 'Make a statement with our designer lighting collection.', category: 'lighting-electrical', rating: 4.6, reviews: 15, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, isFeatured: true, unit: 'item' },
    { name: 'IFLUX 1 GANG SWITCH', price: 350, images: ['/IFLUX 1 GANG SWITCH.png'], description: 'Standard 1-gang electrical switch.', longDescription: 'Durable and reliable IFLUX switch for home use.', category: 'lighting-electrical', rating: 4.8, reviews: 42, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    { name: 'IFLUX 2 GANG SWITCH', price: 450, images: ['/IFLUX 2 GANG SWITCH.png'], description: 'Standard 2-gang electrical switch.', longDescription: 'Control two points from one sleek unit.', category: 'lighting-electrical', rating: 4.7, reviews: 38, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    { name: 'IFLUX WATER HEATER SWITCH (Gold)', price: 850, images: ['/IFLUX WATER HEATER SWITCH 45 Amp (gold).png'], description: '45A High-capacity heater switch.', longDescription: 'Elegant gold finish water heater switch for premium bathrooms.', category: 'lighting-electrical', rating: 4.9, reviews: 25, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    { name: 'Hexagonal Decor Light', price: 4200, images: ['/hexagonal decor light.jpg'], description: 'Modern hexagonal wall light.', longDescription: 'Geometric decor lighting that adds a futuristic touch to your lounge.', category: 'lighting-electrical', rating: 4.5, reviews: 12, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    { name: 'Kitchen Bright Light', price: 1500, images: ['/kitchen bright light.png'], description: 'Focused task lighting for kitchens.', longDescription: 'High-intensity LED light designed for food preparation areas.', category: 'lighting-electrical', rating: 4.4, reviews: 20, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    { name: 'Vellmax Flat Tube 25W', price: 850, images: ['/2FT vellmax Flat Tube 25w.png'], description: 'Energy-saving LED tube light.', longDescription: 'Bright 25W flat tube for office and industrial use.', category: 'lighting-electrical', rating: 4.7, reviews: 55, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    { name: '3 Pin Socket IFLUX', price: 415, images: ['/IFLUXsocket.png'], description: 'Standard 13A socket outlet.', longDescription: 'Safe and durable electrical socket for all appliances.', category: 'lighting-electrical', rating: 4.9, reviews: 110, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    { name: 'Lamp Chandelier MarbleMark', price: 28000, images: ['/Lamp Assorted Chandelier MarbleMark.png'], description: 'Luxury marble-finish chandelier.', longDescription: 'The ultimate luxury lighting piece for grand dining halls.', category: 'lighting-electrical', rating: 5.0, reviews: 5, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    { name: 'Lighting Models Assorted', price: 5500, images: ['/lighting models.png'], description: 'Variety of modern ceiling models.', longDescription: 'Check out our latest architectural lighting samples.', category: 'lighting-electrical', rating: 4.3, reviews: 18, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    
    // --- TANKS (Approx 15 items) ---
    { name: 'Kentank 2000L', price: 15000, images: ['/kentank 2000l.png'], description: 'UV-stabilized 2000L water tank.', longDescription: 'Best-selling domestic water storage solution in Kenya.', category: 'tanks', rating: 4.7, reviews: 85, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    { name: 'Kentank 3000L', price: 22000, images: ['/kentanks 3000L.png'], description: 'Extra large 3000L water tank.', longDescription: 'Industrial capacity water storage for large compounds.', category: 'tanks', rating: 4.8, reviews: 45, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    { name: 'Septic Tank 5000L', price: 45000, images: ['/septic Tank.png'], description: 'Underground septic storage.', longDescription: 'Reinforced heavy-duty tank for waste management.', category: 'tanks', rating: 4.9, reviews: 30, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    { name: 'Cuboid Tank 1000L', price: 9500, images: ['/cuboidTank.PNG'], description: 'Space-saving slimline tank.', longDescription: 'Ideal for balcony or tight corner installations.', category: 'tanks', rating: 4.5, reviews: 22, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },

    // --- PLUMBING (Approx 30 items) ---
    { name: 'Kitchen Sink Double Bowl', price: 8500, images: ['/kitchen sink.png'], description: 'Stainless steel double kitchen sink.', longDescription: 'High-grade anti-rust stainless steel sink for modern kitchens.', category: 'plumbing', rating: 4.6, reviews: 14, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    { name: 'Kitchen Taps Chrome', price: 2500, images: ['/kitchen taps.png'], description: 'Swivel kitchen mixer tap.', longDescription: 'Elegant chrome-finished tap with smooth swivel action.', category: 'plumbing', rating: 4.4, reviews: 28, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    { name: 'KS1010 Brass Shower Mixer', price: 12000, images: ['/KS1010 – 4 Way Concealed Brass Shower Mixer – Shower & Tap.png'], description: '4-Way concealed shower mixer.', longDescription: 'Premium brass construction for a luxury shower experience.', category: 'plumbing', rating: 4.9, reviews: 12, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    { name: 'Brass Shower Head V2', price: 4500, images: ['/KS1010 – 4 Way Concealed Brass Shower Mixer – Shower & Tap 3.png'], description: 'Rainfall brass shower head.', longDescription: 'Large surface area for a relaxing rainfall shower effect.', category: 'plumbing', rating: 4.8, reviews: 19, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    { name: 'Concealed Tap System', price: 7800, images: ['/KS1010 – 4 Way Concealed Brass Shower Mixer – Shower & Tap, 2.png'], description: 'In-wall faucet control system.', longDescription: 'Minimalist plumbing control for designer bathrooms.', category: 'plumbing', rating: 4.7, reviews: 8, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
    { name: 'PPR Pipe 20mm', price: 450, images: ['/ppr pipes.png'], description: 'Standard 20mm PPR pipe.', longDescription: 'High-pressure resistant pipe for hot and cold water.', category: 'plumbing', rating: 4.9, reviews: 200, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'length' },
    { name: 'PVC Pipe 4-inch', price: 1200, images: ['/ppr pipes.png'], description: 'Waste drainage PVC pipe.', longDescription: 'Standard 4-inch pipe for domestic sewage systems.', category: 'plumbing', rating: 4.5, reviews: 150, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'length' },

    // --- ROOFING & CONSTRUCTION (Approx 10 items) ---
    { name: 'Ironsheet Mabati G28', price: 950, images: ['/Ironsheet_Mabati.jpg'], description: 'Zinc-coated roofing sheets.', longDescription: 'Durable gauge 28 mabati for residential roofing.', category: 'roofing', rating: 4.8, reviews: 65, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'sheet' },
    { name: 'Colored Roofing Tile', price: 1400, images: ['/roof 2.png'], description: 'Aesthetic colored roofing sheet.', longDescription: 'Modern profile roofing that combines beauty and strength.', category: 'roofing', rating: 4.7, reviews: 40, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'sheet' },
  ];

  // Fill in the rest with variations to reach ~89 products
  const categories = ['lighting-electrical', 'tanks', 'plumbing', 'decor', 'roofing'];
  const baseCount = products.length;
  for (let i = baseCount; i < 89; i++) {
    const cat = categories[i % categories.length];
    products.push({
      name: `Premium ${cat.replace('-', ' ')} Item #${i + 1}`,
      price: 1000 + (i * 150),
      images: [products[i % baseCount].images[0]],
      description: `High-quality equipment for your ${cat} projects.`,
      longDescription: `This is a premium product in our ${cat} collection, designed for durability and performance in the East African climate.`,
      category: cat,
      rating: 4.0 + (Math.random() * 1),
      reviews: Math.floor(Math.random() * 50) + 5,
      seller: { name: 'Alpha Electricals', id: 'seller-alpha' },
      isFeatured: i % 10 === 0,
      unit: 'item'
    });
  }

  return products;
};

export const allProductsData = generateProducts();

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
