'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { allProductsData as initialProductsData, seedProducts } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    category: string;
    barcode?: string;
    images: string[];
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
  const [products, setProducts] = useState<Product[]>(initialProductsData.map((p, index) => ({...p, id: `local-${index}`})));
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!db) {
        setLoading(false);
        return;
    }

    seedProducts();

    const productsCollection = collection(db, "products");
    
    const unsubscribe = onSnapshot(productsCollection, 
        (snapshot) => {
            if (!snapshot.empty) {
                const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
                setProducts(productList);
            }
            setLoading(false);
        }, 
        async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: productsCollection.path,
                operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
            setLoading(false);
        }
    );

    return () => unsubscribe();
  }, []);

  const addProduct = useCallback(async (productData: ProductFormData) => {
    if (!db) throw new Error("Database not initialized.");
    setSubmitting(true);
    
    const newProductDocument: Omit<Product, 'id'> = {
        ...productData,
        rating: Math.floor(Math.random() * 2) + 3.5,
        reviews: Math.floor(Math.random() * 100),
        seller: { name: 'Alpha Electricals', id: 'seller-alpha' },
        longDescription: productData.description,
        isFeatured: productData.isFeatured || false,
    };

    addDoc(collection(db, "products"), newProductDocument)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: 'products',
                operation: 'create',
                requestResourceData: newProductDocument,
            });
            errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => {
            setSubmitting(false);
        });
  }, []);

  const updateProduct = useCallback(async (productId: string, productData: Partial<ProductFormData>) => {
    if (!db) throw new Error("Database not initialized.");
    if (productId.startsWith('local-')) {
        throw new Error("This product is from local data and cannot be updated.");
    }
    setSubmitting(true);
    
    const productRef = doc(db, "products", productId);
    const updateData: { [key: string]: any } = { ...productData };
    if (productData.description) {
        updateData.longDescription = productData.description;
    }

    updateDoc(productRef, updateData)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: productRef.path,
                operation: 'update',
                requestResourceData: updateData,
            });
            errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => {
            setSubmitting(false);
        });
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
