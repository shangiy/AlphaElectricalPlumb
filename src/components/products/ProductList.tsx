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

  if (loading) return <div>Loading catalog...</div>

  return (
    <div style={{ padding: '20px' }}>
      <h2>Alpha Electrical & Plumbing Catalog</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map((product) => {
          // Generates the full public URL from your Supabase Storage bucket
          const imageUrl = product.image_path
            ? supabase.storage.from('products').getPublicUrl(product.image_path).data.publicUrl
            : product.image_url || '/placeholder.jpg'

          return (
            <div key={product.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
              <img
                src={imageUrl}
                alt={product.name}
                style={{ width: '100%', height: '200px', objectFit: 'contain', borderRadius: '6px' }}
              />
              <h3 style={{ fontSize: '1.1rem', margin: '12px 0 6px' }}>{product.name}</h3>
              <p style={{ fontWeight: 'bold', color: '#2563eb' }}>KES {product.price}</p>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{product.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
