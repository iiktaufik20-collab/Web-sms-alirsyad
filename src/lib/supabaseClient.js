import { createClient } from '@supabase/supabase-js' // atau @supabase/supabase-js

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// PASTIKAN ADA KATA 'export' DI SINI
export const supabase = createClient(supabaseUrl, supabaseAnonKey)