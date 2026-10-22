'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { getProducts } from '@/lib/data';

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
  deleteProduct: (productId: string) => Promise<void>;
  toggleFeatured: (productId: string, currentStatus: boolean) => Promise<void>;
  updateStock: (productId: string, newCount: number) => Promise<void>;
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

  /**
   * Refreshes the local state from Supabase.
   */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Fetch products failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    if (!supabase) return;

    /**
     * Real-time Synchronization:
     * This channel listens for any change to the 'products' table and automatically
     * refreshes the UI. This ensures Bidirectional Sync works flawlessly.
     */
    const channel = supabase
      .channel('public-products-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  const addProduct = useCallback(async (productData: ProductFormData) => {
    if (!supabase) throw new Error("Database service is unavailable.");
    setSubmitting(true);
    try {
      const { error } = await supabase.from('products').insert([{
        name: productData.name,
        price: productData.price,
        category: productData.category,
        description: productData.description,
        long_description: productData.longDescription,
        image_urls: productData.imageUrls,
        is_featured: productData.isFeatured,
        stock_count: productData.stockCount,
        barcode: productData.barcode,
        unit: productData.unit || 'item'
      }]);
      if (error) throw error;
      // Real-time listener handles the refresh
    } finally {
      setSubmitting(false);
    }
  }, []);

  const updateProduct = useCallback(async (productId: string, productData: Partial<ProductFormData>) => {
    if (!supabase) throw new Error("Database service is unavailable.");
    setSubmitting(true);
    try {
      const { error } = await supabase.from('products').update({
        name: productData.name,
        price: productData.price,
        category: productData.category,
        description: productData.description,
        long_description: productData.longDescription,
        image_urls: productData.imageUrls,
        is_featured: productData.isFeatured,
        stock_count: productData.stockCount,
        barcode: productData.barcode,
        unit: productData.unit
      }).eq('id', productId);
      if (error) throw error;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    if (!supabase) throw new Error("Database service is unavailable.");
    setSubmitting(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const toggleFeatured = useCallback(async (productId: string, currentStatus: boolean) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('products').update({ is_featured: !currentStatus }).eq('id', productId);
      if (error) throw error;
    } catch (e) {
      console.error("Toggle featured failed:", e);
    }
  }, []);

  const updateStock = useCallback(async (productId: string, newCount: number) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('products').update({ stock_count: Math.max(0, newCount) }).eq('id', productId);
      if (error) throw error;
    } catch (e) {
      console.error("Update stock failed:", e);
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
    deleteProduct,
    toggleFeatured,
    updateStock,
    getProductById
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
