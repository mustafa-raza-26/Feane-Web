import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────
//  Your Supabase connection — the only file you need to edit.
//  Supabase dashboard → Project Settings → API
//
//  Option A (quick): paste your values between the quotes below.
//  Option B (safer): leave these empty and put them in a ".env" file:
//      VITE_SUPABASE_URL=...
//      VITE_SUPABASE_ANON_KEY=...
// ─────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://escflpzgeayghspqdkcr.supabase.co'       // e.g. 'https://xxxxxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_X3l_oYzwfdLDEfOVXIwB2w_wcYfCBn2'  // your project's "anon public" key

const url = SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
const anonKey = SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(url && anonKey)

// Same name the old supabase.js used: `client`.
// It is null until the values above are filled in, so the rest of the site still works.
export const client = supabaseConfigured ? createClient(url, anonKey) : null

export const SUPABASE_NOT_CONFIGURED_MESSAGE =
  'Supabase is not configured yet. Open src/lib/supabase.js and paste your URL and anon key.'
