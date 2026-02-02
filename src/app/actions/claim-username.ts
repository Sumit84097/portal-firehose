// app/actions/claim-username.ts
'use server'

import { createClient } from '@supabase/supabase-js'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ← must be in .env.local / Vercel env — never in git
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
)

export async function claimUsernameServer({
  did,
  username,
  message,
  signature,
  walletAddress,
  avatarUrl,
}: {
  did: string
  username: string
  message: string
  signature: string
  walletAddress?: string
  avatarUrl?: string | null
}) {
  // Prevent overwriting someone else's username
  const { data: existingUsername } = await adminSupabase
    .from('profiles')
    .select('did')
    .eq('username', username)
    .maybeSingle()

  if (existingUsername && existingUsername.did !== did) {
    return { success: false, error: 'Username already taken by another user' }
  }

  const { error } = await adminSupabase
    .from('profiles')
    .upsert(
      {
        did,
        username,
        username_claim_message: message,
        username_claim_signature: signature,
        wallet_address: walletAddress || null,
        avatar_url: avatarUrl || null,
      },
      { onConflict: 'did' }
    )

  if (error) {
    console.error('Server claim error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}