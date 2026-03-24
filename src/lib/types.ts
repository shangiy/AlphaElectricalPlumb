

export interface Review {
  id: string;
  author: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface WholesalePrice {
  quantity: number;
  price: number;
  unit: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  oldPrice?: number; // Add oldPrice for sales
  unit?: string; // e.g., 'meter', 'item', 'roll'
  wholesale?: WholesalePrice;
  images: string[];
  category: string;
  rating: number;
  reviews: number;
  reviewsList?: Review[];
  seller: {
    name: string;
    id: string;
  };
  barcode?: string;
  colors?: string[];
  isFeatured?: boolean;
}

export interface Category {
  id:string;
  name: string;
}

export interface HomePageCategory {
  id: string;
  name: string;
  image: string;
}

export interface CarouselCategory {
  id: string;
  name: string;
  image: string;
  href: string;
}

export interface MockUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'staff' | 'user';
  avatarUrl?: string;
  signedUp: string;
  lastSeen: string;
  orders: number;
  visitDuration: number; // in minutes
}

export interface Transaction {
  id: string;
  customerName: string;
  email: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  productName: string;
}
