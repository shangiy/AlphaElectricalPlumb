
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

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();

    if (!supabase) return;

    // Set up real-time subscription for product updates
    const channel = supabase
      .channel('public:products')
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
      const { error } = await supabase.from('products').insert([productData]);
      if (error) throw error;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const updateProduct = useCallback(async (productId: string, productData: Partial<ProductFormData>) => {
    if (!supabase) throw new Error("Database service is unavailable.");
    const { error } = await supabase.from('products').update(productData).eq('id', productId);
    if (error) throw error;
  }, []);

  const toggleFeatured = useCallback(async (productId: string, currentStatus: boolean) => {
    if (!supabase) return;
    await supabase.from('products').update({ isFeatured: !currentStatus }).eq('id', productId);
  }, []);

  const updateStock = useCallback(async (productId: string, newCount: number) => {
    if (!supabase) return;
    await supabase.from('products').update({ stockCount: Math.max(0, newCount) }).eq('id', productId);
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
