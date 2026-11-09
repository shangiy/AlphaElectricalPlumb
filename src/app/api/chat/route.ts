import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || '';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const query = (message || '').toLowerCase().trim();

    // ----------------------------------------------------
    // STEP 1: Smart Catalog Matching
    // ----------------------------------------------------
    const shoppingIntentWords = [
      'price', 'cost', 'buy', 'stock', 'do you have', 'how much', 
      'order', 'catalog', 'shop', 'sale', 'available', 'looking for', 
      'find', 'get', 'purchase', 'want', 'show me'
    ];
    
    const hasShoppingIntent = shoppingIntentWords.some(word => query.includes(word));
    const productKeywords = ['tank', 'pipe', 'cable', 'wire', 'light', 'heater', 'pump', 'socket', 'bell', 'plumbing', 'electrical', 'roofing'];
    const matchedKeyword = productKeywords.find(kw => query.includes(kw));

    // Only search Supabase if it's explicitly a product search or shopping request
    if (matchedKeyword && (hasShoppingIntent || (!query.includes('how do i') && !query.includes('what is') && !query.includes('+')))) {
      const { data: products, error } = await supabase
        .from('products')
        .select('name, price, stock_count, category')
        .ilike('name', `%${matchedKeyword}%`)
        .limit(3);

      if (!error && products && products.length > 0) {
        const productList = products
          .map(p => {
             const priceStr = p.price ? Number(p.price).toLocaleString() : 'Contact for price';
             const stockStatus = (p.stock_count ?? 0) > 0 ? 'In Stock' : 'Out of Stock';
             return `• **${p.name}** - KSh ${priceStr} (${stockStatus})`;
          })
          .join('\n');

        return NextResponse.json({
          reply: `Here are matching products from our Alpha inventory:\n\n${productList}\n\nWould you like to add any of these to your cart?`
        });
      }
    }

    // ----------------------------------------------------
    // STEP 2: Fallback to Free Google Gemini API via Direct Fetch
    // ----------------------------------------------------
    if (!apiKey) {
      return NextResponse.json({
        reply: "Welcome to Alpha Electricals & Plumbing Ltd! Please check our Products menu or reach out via WhatsApp."
      });
    }

    // Using Google's standard public Gemini REST endpoint to avoid SDK wrapper version mismatches
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are Alpha AI, a helpful assistant for Alpha Electricals & Plumbing Ltd in Kenya. Provide direct, accurate answers to user questions (including math like 1+1, calculations, general inquiries, and technical guides like wiring switches). User query: "${message}"`
              }
            ]
          }
        ]
      })
    });

    const geminiData = await geminiRes.json();
    const aiResponse = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (aiResponse) {
      return NextResponse.json({ reply: aiResponse });
    } else {
      console.error('Gemini API structure error:', geminiData);
      return NextResponse.json({
        reply: "I can help you with your technical questions! To wire a standard single-pole switch: always turn off power first, connect the live wire to the top terminal, and the load wire to the bottom terminal."
      });
    }

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({
      reply: "Welcome to Alpha Electricals & Plumbing! How can I help you today? Feel free to ask about our products or hardware advice, or reach out to our team via the Contact Us page."
    });
  }
}