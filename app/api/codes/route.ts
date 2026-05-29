import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const supabase = createServiceClient()

  const { data: codes, error } = await supabase
    .from('codes_view')
    .select('*')
    .order('created_at', { ascending: false }) as any

  if (error) {
    return NextResponse.json({ codes: [], error: error.message }, { status: 500 })
  }

  return NextResponse.json({ codes })
}

export async function POST(req: NextRequest) {
  const supabase = createServiceClient()
  const { code, playlist_id, max_devices, subscriber_id } = await req.json()

  if (!code || !playlist_id) {
    return NextResponse.json({ error: 'Code and playlist required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('activation_codes')
    .insert({
      code,
      playlist_id,
      subscriber_id: subscriber_id || null,
      max_devices: max_devices || 1,
      expires_at: null
    } as any)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}