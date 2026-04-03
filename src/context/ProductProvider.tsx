
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { allProductsData as initialProductsData } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, getDocs, writeBatch } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';


export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    category: string;
    barcode?: string;
    imageUrls: string[];
    colors?: string[];
    isFeatured?: boolean;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  submitting: boolean;
  addProduct: (productData: ProductFormData) => Promise<void>;
  updateProduct: (productId: string, productData: Partial<ProductFormData>) => Promise<void>;
  getProductById: (productId: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!db) {
        setLoading(false);
        return;
    }

    const productsCollection = collection(db, "products");

    // Reset and Seeding logic
    const syncDatabase = async () => {
        try {
            const snapshot = await getDocs(productsCollection);
            const currentDocs = snapshot.docs;
            
            const batch = writeBatch(db);
            let hasChanges = false;

            const validUniqueIds = initialProductsData.map(p => 
                p.barcode || p.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
            );

            // Cleanup old items using old 'images' field or missing 'imageUrls'
            currentDocs.forEach((d) => {
                const data = d.data();
                if (!data.imageUrls || !validUniqueIds.includes(d.id)) {
                    batch.delete(d.ref);
                    hasChanges = true;
                }
            });

            // Seeding new storage-backed items
            initialProductsData.forEach((product) => {
                const uniqueId = product.barcode || product.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                const docRef = doc(productsCollection, uniqueId);
                
                const alreadyExists = currentDocs.some(d => d.id === uniqueId);
                if (!alreadyExists) {
                    batch.set(docRef, product);
                    hasChanges = true;
                }
            });

            if (hasChanges) {
                await batch.commit();
            }
        } catch (error) {
            console.error("Sync error:", error);
        }
    };

    syncDatabase();

    const unsubscribe = onSnapshot(productsCollection, 
        (snapshot) => {
            const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
            setProducts(productList);
            setLoading(false);
        }, 
        async (serverError) => {
            setLoading(false);
        }
    );

    return () => unsubscribe();
  }, []);

  const addProduct = useCallback(async (productData: ProductFormData) => {
    // Basic implementation for MVP
    setSubmitting(true);
    setSubmitting(false);
  }, []);

  const updateProduct = useCallback(async (productId: string, productData: Partial<ProductFormData>) => {
    setSubmitting(true);
    setSubmitting(false);
  }, []);

  const getProductById = useCallback((productId: string): Product | undefined => {
      return products.find(p => p.id === productId);
  }, [products]);

  const value = {
    products,
    loading,
    submitting,
    addProduct,
    updateProduct,
    getProductById
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
