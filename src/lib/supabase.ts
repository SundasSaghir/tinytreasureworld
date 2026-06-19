import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://afawadbxgepeuyhjmstn.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_lCrfXdLF8XyPvbBhQzXF0w_2UGdrH41'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
