import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Initialize Gemini AI (supporting both environment key names)
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const query = (message || '').toLowerCase();

    // ----------------------------------------------------
    // STEP 1: Smart Catalog Matching (Only trigger if user wants to buy/find a product)
    // ----------------------------------------------------
    const isShoppingQuery = 
        query.includes('price') || 
        query.includes('cost') || 
        query.includes('buy') || 
        query.includes('stock') || 
        query.includes('do you have') || 
        query.includes('how much');

    const productKeywords = ['tank', 'pipe', 'cable', 'wire', 'light', 'heater', 'pump', 'socket', 'bell', 'plumbing', 'electrical', 'roofing'];
    const matchedKeyword = productKeywords.find(kw => query.includes(kw));

    // Only search database if it's a shopping question OR explicitly names a product without "how do i"
    if (matchedKeyword && (isShoppingQuery || !query.startsWith('how do i'))) {
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
          reply: `Here are matching products from our Alpha inventory:\n\n${productList}\n\nWould you like to add any of these to your cart or explore our collections?`
        });
      }
    }

    // ----------------------------------------------------
    // STEP 2: Fallback to Free Google Gemini API (Handles "How do I...", math, and general advice)
    // ----------------------------------------------------
    if (!apiKey) {
      return NextResponse.json({
        reply: "Welcome to Alpha Electricals & Plumbing Ltd! Please check our Products menu above or contact our team directly."
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are Alpha AI, a helpful shopping and technical assistant for Alpha Electricals & Plumbing Ltd in Kenya. Keep your answers concise, professional, and practical for customers asking about electrical supplies, plumbing equipment, installation guides, or general hardware queries. User query: "${message}"`;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    return NextResponse.json({ reply: aiResponse });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { reply: "I'm having a temporary connection issue. Please explore our categories above or reach out via our Contact Us page!" },
      { status: 500 }
    );
  }
}
