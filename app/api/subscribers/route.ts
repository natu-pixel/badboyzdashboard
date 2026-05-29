import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const supabase = createServiceClient()

  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('id, username, email, status')
    .order('created_at', { ascending: false }) as any

  if (error) {
    return NextResponse.json({ subscribers: [], error: error.message }, { status: 500 })
  }

  return NextResponse.json({ subscribers })
}

export async function POST(req: NextRequest) {
  const supabase = createServiceClient()
  const { username, email, playlist_type, playlist_url, max_devices } = await req.json()

  if (!username || !email) {
    return NextResponse.json({ error: 'Username and email required' }, { status: 400 })
  }

  const { data: subscriber, error: subError } = await supabase
    .from('subscribers')
    .insert({
      username,
      email,
      status: 'active'
    } as any)
    .select()
    .single()

  if (subError) {
    return NextResponse.json({ error: subError.message }, { status: 500 })
  }

  if (playlist_type && playlist_url) {
    const { data: playlist, error: plError } = await supabase
      .from('playlists')
      .insert({
        name: username + "'s " + playlist_type.toUpperCase(),
        type: playlist_type,
        url: playlist_url,
        is_active: true
      } as any)
      .select()
      .single()

    if (plError) {
      return NextResponse.json({ error: plError.message }, { status: 500 })
    }

    const code = Math.random().toString(36).substring(2, 7).toUpperCase()

    const { error: codeError } = await supabase
      .from('activation_codes')
      .insert({
        code,
        playlist_id: (playlist as any).id,
        subscriber_id: (subscriber as any).id,
        max_devices: max_devices || 1,
        expires_at: null
      } as any)

    if (codeError) {
      return NextResponse.json({ error: codeError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}