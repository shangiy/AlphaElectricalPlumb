'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { allProductsData as initialProductsData, seedProducts } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';


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
    // If Firebase config is not available, we stay with local data
    if (!db) {
        console.warn("Firestore 'db' instance is null. Running in local fallback mode.");
        setLoading(false);
        return;
    }

    // Immediately seed if necessary, but don't block.
    seedProducts();

    const productsCollection = collection(db, "products");
    
    // Set up the real-time listener
    const unsubscribe = onSnapshot(productsCollection, 
        (snapshot) => {
            if (!snapshot.empty) {
                const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
                setProducts(productList);
            } else {
                console.log("Firestore is empty, continuing with local fallback data.");
            }
            setLoading(false);
        }, 
        (error) => {
            console.error("Firestore snapshot error. Using local fallback data.", error);
            // Local data is already set, so we just stop loading to show fallback content.
            setLoading(false);
        }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const addProduct = useCallback(async (productData: ProductFormData) => {
    if (!db) throw new Error("Database not initialized.");
    setSubmitting(true);
    try {
        const newProductDocument: Omit<Product, 'id'> = {
            ...productData,
            rating: Math.floor(Math.random() * 2) + 3.5, // 3.5 to 4.5
            reviews: Math.floor(Math.random() * 100),
            seller: { name: 'Alpha Electricals', id: 'seller-alpha' },
            longDescription: productData.description,
            isFeatured: productData.isFeatured || false,
        };
        await addDoc(collection(db, "products"), newProductDocument);
        // Real-time listener will update the state
    } catch (error) {
        console.error("Error adding product:", error);
        throw error; // Re-throw to be caught in the form
    } finally {
        setSubmitting(false);
    }
  }, []);

  const updateProduct = useCallback(async (productId: string, productData: Partial<ProductFormData>) => {
    if (!db) throw new Error("Database not initialized.");
    if (productId.startsWith('local-')) {
        console.error("Cannot update a local fallback product.");
        setSubmitting(false);
        throw new Error("This product is from local data and cannot be updated.");
    }
    setSubmitting(true);
    try {
        const productRef = doc(db, "products", productId);
        
        const updateData: { [key: string]: any } = { ...productData };
        if (productData.description) {
            updateData.longDescription = productData.description;
        }

        await updateDoc(productRef, updateData);
        // Real-time listener will update the state
    } catch (error) {
        console.error("Error updating product:", error);
        throw error; // Re-throw to be caught in the form
    } finally {
        setSubmitting(false);
    }
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
