
// app/actions/get-feed.ts
'use server'

import { createClient } from '@supabase/supabase-js'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BUCKET_NAME = 'artifacts' // change if your bucket name is different

export async function getShieldedFeed({
  limit = 10,
  afterId = null,
}: {
  limit?: number
  afterId?: string | null
}) {
  let query = adminSupabase
    .from('artifacts')
    .select('id, author_did, caption, content_url, content_hash, signature, created_at') // ← removed media_type
    .order('created_at', { ascending: false })
    .limit(limit)

  if (afterId) {
    query = query.lt('id', afterId)
  }

  const { data: rows, error } = await query

  if (error) {
    console.error('Artifacts fetch error:', error.message)
    return { success: false, error: error.message, data: [] }
  }

  if (!rows?.length) {
    return { success: true, data: [] }
  }

  // Get unique author DIDs
  const dids = [...new Set(rows.map(r => r.author_did))]

  // Fetch profiles
  const { data: profiles } = await adminSupabase
    .from('profiles')
    .select('did, username, avatar_url')
    .in('did', dids)

  const profileMap = new Map(profiles?.map(p => [p.did, p]) || [])

  // Generate signed URLs + merge author data
  const feedItems = await Promise.all(
    rows.map(async (item) => {
      let signed_url = item.content_url

      // Only sign if it's a storage path (not already a public URL)
      if (item.content_url && !item.content_url.startsWith('http')) {
        const { data: signed } = await adminSupabase.storage
          .from(BUCKET_NAME)
          .createSignedUrl(item.content_url, 3600) // 1 hour expiry

        signed_url = signed?.signedUrl || null
      }

      const author = profileMap.get(item.author_did)

      return {
        ...item,
        signed_url,
        author_username: author?.username || 'anonymous',
        author_avatar: author?.avatar_url || null,
      }
    })
  )

  return { success: true, data: feedItems }
}