import { createClient } from '@supabase/supabase-js'

// Pastikan menggunakan import.meta.env, BUKAN process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Waduh! API Key Supabase belum terbaca di environment.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
