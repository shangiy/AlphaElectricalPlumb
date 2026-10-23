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

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Fetch products failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    if (!supabase) return;

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
      const payload: Record<string, any> = {
        name: productData.name,
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
      await fetchProducts();
    } finally {
      setSubmitting(false);
    }
  }, [fetchProducts]);

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
      await fetchProducts();
    } finally {
      setSubmitting(false);
    }
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (productId: string) => {
    if (!supabase) throw new Error("Database service is unavailable.");
    setSubmitting(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      await fetchProducts();
    } finally {
      setSubmitting(false);
    }
  }, [fetchProducts]);

  const toggleFeatured = useCallback(async (productId: string, currentStatus: boolean) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('products').update({ is_featured: !currentStatus }).eq('id', productId);
      if (error) throw error;
      await fetchProducts();
    } catch (e) {
      console.error("Toggle featured failed:", e);
    }
  }, [fetchProducts]);

  const updateStock = useCallback(async (productId: string, newCount: number) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('products').update({ stock_count: Math.max(0, newCount) }).eq('id', productId);
      if (error) throw error;
      await fetchProducts();
    } catch (e) {
      console.error("Update stock failed:", e);
    }
  }, [fetchProducts]);

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