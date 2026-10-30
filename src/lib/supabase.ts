import { createClient } from '@supabase/supabase-js';

/**
 * Standard Supabase Client Configuration.
 * Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY 
 * are set in your .env file to prevent "Failed to fetch" errors.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize the client with safety checks
export const supabase = (supabaseUrl && supabaseAnonKey) 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null as any;

/**
 * Global resilience check:
 * Provides diagnostic warnings if the environment is misconfigured.
 */
if (typeof window !== 'undefined') {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "❌ CRITICAL ERROR: Supabase environment variables are missing! " +
      "Check your .env file. Requests to the database will fail with 'TypeError: Failed to fetch'."
    );
  }
}
