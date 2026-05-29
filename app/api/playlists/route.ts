import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const supabase = createServiceClient()

  const { data: playlists, error } = await supabase
    .from('playlists')
    .select('id, name, type, url, is_active')
    .order('created_at', { ascending: false }) as any

  if (error) {
    return NextResponse.json({ playlists: [], error: error.message }, { status: 500 })
  }

  return NextResponse.json({ playlists })
}

export async function POST(req: NextRequest) {
  const supabase = createServiceClient()
  const { name, type, url } = await req.json()

  if (!name || !type || !url) {
    return NextResponse.json({ error: 'Name, type and URL required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('playlists')
    .insert({
      name,
      type,
      url,
      is_active: true
    } as any)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}