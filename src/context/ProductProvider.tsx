
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface ProductProviderProps {
  children: ReactNode;
}

export type ProductFormData = Omit<Product, 'id'>;

interface ProductContextType {
  products: Product[];
  loading: boolean;
  submitting: boolean;
  addProduct: (productData: ProductFormData) => Promise<void>;
  updateProduct: (productId: string, productData: Partial<ProductFormData>) => Promise<void>;
  toggleFeatured: (productId: string, currentStatus: boolean) => void;
  updateStock: (productId: string, newCount: number) => void;
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

    const productsCollection = collection(db, "products");
    const productsQuery = query(productsCollection, orderBy("name", "asc"));

    const unsubscribe = onSnapshot(productsQuery, 
        (snapshot) => {
            const productList = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                stockCount: 0, // Fallback for missing field
                isFeatured: false, // Fallback for missing field
                ...doc.data() 
            } as Product));
            
            setProducts(productList);
            setLoading(false);
        }, 
        async (serverError) => {
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

  const addProduct = useCallback(async (productData: ProductFormData) => {
    // Implementation for real Firebase add goes here in a full app
    console.log("Add product requested", productData);
  }, []);

  const updateProduct = useCallback(async (productId: string, productData: Partial<ProductFormData>) => {
    if (!db) return;
    const productRef = doc(db, 'products', productId);
    updateDocumentNonBlocking(productRef, productData);
  }, []);

  const toggleFeatured = useCallback((productId: string, currentStatus: boolean) => {
    if (!db) return;
    const productRef = doc(db, "products", productId);
    updateDocumentNonBlocking(productRef, { isFeatured: !currentStatus });
  }, []);

  const updateStock = useCallback((productId: string, newCount: number) => {
    if (!db) return;
    const productRef = doc(db, "products", productId);
    updateDocumentNonBlocking(productRef, { stockCount: Math.max(0, newCount) });
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
    toggleFeatured,
    updateStock,
    getProductById
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
