
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

interface ProductProviderProps {
  children: ReactNode;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  submitting: boolean;
  addProduct: (productData: any) => Promise<void>;
  updateProduct: (productId: string, productData: any) => Promise<void>;
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

export function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!db) {
        setLoading(false);
        return;
    }

    // We no longer run 'syncDatabase' here because it was deleting migrated items.
    // The database is now managed via your migration scripts and the Admin Panel.

    const productsCollection = collection(db, "products");
    const productsQuery = query(productsCollection, orderBy("name", "asc"));

    const unsubscribe = onSnapshot(productsQuery, 
        (snapshot) => {
            const productList = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            } as Product));
            
            console.log(`Loaded ${productList.length} products from Firestore`);
            setProducts(productList);
            setLoading(false);
        }, 
        async (serverError) => {
            console.error("Firestore Listen Error:", serverError);
            const permissionError = new FirestorePermissionError({
                path: 'products',
                operation: 'list',
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
            setLoading(false);
        }
    );

    return () => unsubscribe();
  }, []);

  const addProduct = useCallback(async (productData: any) => {
    setSubmitting(true);
    // Implementation for manual adding via Admin Panel can be added here
    setSubmitting(false);
  }, []);

  const updateProduct = useCallback(async (productId: string, productData: any) => {
    setSubmitting(true);
    // Implementation for manual updates via Admin Panel can be added here
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
