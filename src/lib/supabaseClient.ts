import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mieyjseiypykozsfgazj.supabase.co' // Found in your Project Settings > API
const supabaseAnonKey = 'sb_publishable_IF5Z1vWWAbG5b5Syl-ytTQ_u5G43LtM' // Your Publishable key from the top box

export const supabase = createClient(supabaseUrl, supabaseAnonKey)