'use server';

/**
 * @fileOverview Server Actions for Admin User Management.
 * Uses the Service Role client to bypass RLS for role management.
 */

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

/**
 * Promotes a user to a specific role based on their email.
 */
export async function promoteUserAdmin(email: string, role: 'admin' | 'staff' | 'user') {
  if (!supabaseAdmin) {
    throw new Error("Admin configuration missing. Ensure SUPABASE_SERVICE_ROLE_KEY is set.");
  }

  // 1. Find the user in the profiles table by email
  // Standardized on 'full_name' and 'email' for the admin sync
  const { data: userProfile, error: findError } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, role')
    .eq('email', email)
    .single();

  if (findError || !userProfile) {
    throw new Error(`User with email "${email}" not found in the profiles database.`);
  }

  // 2. Update their role
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ role })
    .eq('id', userProfile.id);

  if (updateError) throw updateError;

  revalidatePath('/admin/users');
  revalidatePath('/admin/settings');
  
  return { success: true, name: userProfile.full_name || 'Verified User' };
}