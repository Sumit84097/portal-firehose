// app/actions/ensure-profile.ts
'use server'

import { createClient } from '@supabase/supabase-js'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function ensureProfile(did: string, extraData?: {
  username?: string
  avatar_url?: string | null
}) {
  const { data: existing } = await adminSupabase
    .from('profiles')
    .select('id')
    .eq('did', did)
    .maybeSingle()

  if (existing) {
    return { success: true, exists: true }
  }

  const { error } = await adminSupabase
    .from('profiles')
    .insert({
      did,
      username: extraData?.username || null,
      avatar_url: extraData?.avatar_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Profile creation error:', error)
    return { success: false, error: error.message }
  }

  return { success: true, exists: false }
}