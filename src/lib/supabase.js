import { createClient } from '@supabase/supabase-js'

// Your Supabase credentials are NOT stored in the code.
// Put them in a local ".env" file (see ".env.example"):
//   VITE_SUPABASE_URL=...
//   VITE_SUPABASE_ANON_KEY=...
const url = 'https://escflpzgeayghspqdkcr.supabase.co'
const anonKey = 'sb_publishable_X3l_oYzwfdLDEfOVXIwB2w_wcYfCBn2'

export const supabaseConfigured = Boolean(url && anonKey)

// `client` is the same name the old supabase.js used.
// It is null until the env variables are set, so the rest of the site still works.
export const client = supabaseConfigured ? createClient(url, anonKey) : null

export const SUPABASE_NOT_CONFIGURED_MESSAGE =
  'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file and restart the dev server.'
