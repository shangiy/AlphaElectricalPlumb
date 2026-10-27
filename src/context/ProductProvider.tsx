'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { getProducts } from '@/lib/data';

interface ProductProviderProps {
  children: ReactNode;
}

export type ProductFormData = Omit<Product, 'id' | 'rating' | 'reviews'>;

/** URL-safe slug; the random suffix keeps it unique (products.slug is NOT NULL UNIQUE). */
const makeSlug = (name: string) =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)}-${Math.random().toString(36).slice(2, 7)}`;

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
  refreshProducts: () => Promise<void>;
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

  const refreshProducts = useCallback(async () => {
    try {
      // Fetch fresh data from Supabase wrapper
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Fetch products failed:", error);
      throw error; // Throw so UI can catch it
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts().catch(() => {});

    if (!supabase) return;

    // Realtime subscription setup
    const channel = supabase
      .channel('public-products-sync')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'products' }, 
        (payload) => {
          console.log("Realtime change detected:", payload);
          refreshProducts().catch(() => {});
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshProducts]);

  const addProduct = useCallback(async (productData: ProductFormData) => {
    if (!supabase) throw new Error("Database service is unavailable.");
    setSubmitting(true);
    try {
      const payload: Record<string, any> = {
        name: productData.name,
        slug: makeSlug(productData.name),
        price: productData.price,
        category: productData.category,
        description: productData.description,
        long_description: productData.longDescription,
        image_urls: productData.imageUrls,
        image_url: productData.imageUrls?.[0] || '',
        image: productData.imageUrls?.[0] || '',
        is_featured: productData.isFeatured ?? false,
        stock_count: productData.stockCount ?? 0,
        unit: productData.unit || 'item'
      };

      if (productData.barcode) payload.barcode = productData.barcode;

      const { error } = await supabase.from('products').insert([payload]);
      if (error) throw error;
      await refreshProducts();
    } finally {
      setSubmitting(false);
    }
  }, [refreshProducts]);

  const updateProduct = useCallback(async (productId: string, productData: Partial<ProductFormData>) => {
    if (!supabase) throw new Error("Database service is unavailable.");
    setSubmitting(true);
    try {
      const payload: Record<string, any> = {};
      if (productData.name !== undefined) payload.name = productData.name;
      if (productData.price !== undefined) payload.price = productData.price;
      if (productData.category !== undefined) payload.category = productData.category;
      if (productData.description !== undefined) payload.description = productData.description;
      if (productData.longDescription !== undefined) payload.long_description = productData.longDescription;
      if (productData.imageUrls !== undefined) {
        payload.image_urls = productData.imageUrls;
        payload.image_url = productData.imageUrls[0] || '';
        payload.image = productData.imageUrls[0] || '';
      }
      if (productData.isFeatured !== undefined) payload.is_featured = productData.isFeatured;
      if (productData.stockCount !== undefined) payload.stock_count = productData.stockCount;
      if (productData.barcode !== undefined) payload.barcode = productData.barcode;
      if (productData.unit !== undefined) payload.unit = productData.unit;
      payload.updated_at = new Date().toISOString();

      const { error } = await supabase.from('products').update(payload).eq('id', productId);
      if (error) throw error;
      
      await refreshProducts();
    } finally {
      setSubmitting(false);
    }
  }, [refreshProducts]);

  const deleteProduct = useCallback(async (productId: string) => {
    if (!supabase) throw new Error("Database service is unavailable.");
    setSubmitting(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      await refreshProducts();
    } finally {
      setSubmitting(false);
    }
  }, [refreshProducts]);

  const toggleFeatured = useCallback(async (productId: string, currentStatus: boolean) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('products').update({ is_featured: !currentStatus }).eq('id', productId);
      if (error) throw error;
      await refreshProducts();
    } catch (e) {
      console.error("Toggle featured failed:", e);
    }
  }, [refreshProducts]);

  const updateStock = useCallback(async (productId: string, newCount: number) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('products').update({ stock_count: Math.max(0, newCount) }).eq('id', productId);
      if (error) throw error;
      await refreshProducts();
    } catch (e) {
      console.error("Update stock failed:", e);
    }
  }, [refreshProducts]);

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
    getProductById,
    refreshProducts
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}