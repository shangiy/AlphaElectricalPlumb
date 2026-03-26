'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { allProductsData as initialProductsData } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, onSnapshot, getDocs, writeBatch, deleteDoc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';


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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!db) {
        setLoading(false);
        return;
    }

    const productsCollection = collection(db, "products");

    // Seeding and Cleanup logic
    const syncDatabase = async () => {
        try {
            const snapshot = await getDocs(productsCollection);
            const currentDocs = snapshot.docs;
            
            // 1. CLEANUP: Find and remove documents that are duplicates or auto-generated "Item #"
            const batch = writeBatch(db);
            let hasCleanup = false;
            const seenNames = new Set<string>();

            currentDocs.forEach((d) => {
                const data = d.data();
                const name = data.name || '';
                
                // Pattern for auto-generated items ending in "#" then digits
                const isGenerated = /#\s*\d+$/.test(name);
                const isDuplicate = seenNames.has(name);

                if (isGenerated || isDuplicate) {
                    batch.delete(d.ref);
                    hasCleanup = true;
                } else {
                    seenNames.add(name);
                }
            });

            // 2. SEEDING: Add high-quality unique items if they don't exist
            // We use fixed IDs derived from barcodes or slugified names to prevent future duplication
            initialProductsData.forEach((product) => {
                const uniqueId = product.barcode || product.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                const docRef = doc(productsCollection, uniqueId);
                
                // Only seed if this specific unique ID isn't already in the current set
                const alreadyExists = currentDocs.some(d => d.id === uniqueId);
                if (!alreadyExists) {
                    batch.set(docRef, product);
                    hasCleanup = true;
                }
            });

            if (hasCleanup) {
                await batch.commit().catch(async (error) => {
                    errorEmitter.emit('permission-error', new FirestorePermissionError({
                        path: 'products',
                        operation: 'write',
                    } satisfies SecurityRuleContext));
                });
            }
        } catch (error) {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: 'products',
                operation: 'list',
            } satisfies SecurityRuleContext));
        }
    };

    syncDatabase();

    const unsubscribe = onSnapshot(productsCollection, 
        (snapshot) => {
            const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
            // Filter out any duplicates that might have slipped through in memory
            const uniqueProducts = productList.filter((p, index, self) => 
                index === self.findIndex((t) => t.name === p.name)
            );
            
            setProducts(uniqueProducts);
            setLoading(false);
        }, 
        async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: productsCollection.path,
                operation: 'list',
            } satisfies SecurityRuleContext);
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

    // Use barcode or generated slug as ID to maintain uniqueness
    const uniqueId = productData.barcode || productData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const docRef = doc(db, "products", uniqueId);

    setDoc(docRef, newProductDocument)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: 'products',
                operation: 'create',
                requestResourceData: newProductDocument,
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => {
            setSubmitting(false);
        });
  }, []);

  const updateProduct = useCallback(async (productId: string, productData: Partial<ProductFormData>) => {
    if (!db) throw new Error("Database not initialized.");
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
            } satisfies SecurityRuleContext);
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
