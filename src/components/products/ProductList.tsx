'use client';

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')

      if (error) {
        console.error('Error fetching products:', error)
      } else {
        setProducts(data || [])
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  if (loading) return <div className="p-20 text-center text-xl font-bold animate-pulse text-muted-foreground">Loading catalog...</div>

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold font-headline mb-8 text-accent text-center md:text-left">Alpha Electrical & Plumbing Catalog</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => {
          // Use 'product-images' bucket and strip 'Saved Pictures/' if present
          const cleanPath = product.image_path ? product.image_path.replace('Saved Pictures/', '') : ''
          
          const imageUrl = cleanPath
            ? supabase.storage.from('product-images').getPublicUrl(cleanPath).data.publicUrl
            : '/placeholder.jpg'

          return (
            <div key={product.id} className="bg-card border rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
              <div className="aspect-square w-full mb-4 overflow-hidden rounded-xl bg-secondary/20 flex items-center justify-center border border-border/50">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image+Found";
                  }}
                />
              </div>
              
              <div className="flex flex-col flex-grow">
                <h3 className="text-lg font-bold font-headline mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-2xl font-black text-primary mb-2">
                  KES {product.price?.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-grow">
                  {product.description}
                </p>

                {/* WhatsApp Inquiry Button */}
                <a
                  href={`https://wa.me/254717132366?text=Hello%20Alpha%20Electrical,%20I%20am%20interested%20in%20buying%20*${encodeURIComponent(product.name)}*%20priced%20at%20KES%20${product.price?.toLocaleString()}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <img src="/whatsapp--v1.png" alt="" className="w-5 h-5 invert brightness-0" />
                  Inquire via WhatsApp
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
