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
    const query = (message || '').toLowerCase().trim();

    // ----------------------------------------------------
    // STEP 1: Expanded Shopping Intent & Catalog Matching
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
    // We bypass DB if it looks like a "how to", "what is", or math query
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
          reply: `Here are matching products from our Alpha inventory:\n\n${productList}\n\nWould you like to add any of these to your cart or explore our collections?`
        });
      }
    }

    // ----------------------------------------------------
    // STEP 2: Fallback to Free Google Gemini AI (Math, General, & Technical Advice)
    // ----------------------------------------------------
    if (!apiKey) {
      return NextResponse.json({
        reply: "Welcome to Alpha Electricals & Plumbing Ltd! Please check our Products menu above or contact our team directly via WhatsApp."
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are Alpha AI, a helpful assistant for Alpha Electricals & Plumbing Ltd in Kenya. Provide direct, accurate, and professional answers to user questions (including math, calculations, general inquiries, and technical guides like wiring switches or plumbing setups). User query: "${message}"`;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    return NextResponse.json({ reply: aiResponse });

  } catch (error) {
    console.error('Chat API Error:', error);
    // Returns a friendly fallback text instead of a hard crash 500 error
    return NextResponse.json(
      { reply: "Welcome to Alpha Electricals & Plumbing! How can I help you today? Feel free to ask about our products or hardware advice, or reach out to our team via the Contact Us page." },
      { status: 200 } 
    );
  }
}
