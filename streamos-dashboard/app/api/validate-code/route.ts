import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

/**
 * POST /api/validate-code
 * Called by the Android TV app on first launch.
 *
 * Body: { code: string, android_id: string, tv_name?: string }
 * Returns: { valid: boolean, playlist_url?: string, message?: string }
 */
export async function POST(req: NextRequest) {
  const { code, android_id, tv_name } = await req.json()

  if (!code || !android_id) {
    return NextResponse.json({ valid: false, message: 'Missing code or device ID' }, { status: 400 })
  }

  const supabase = createServiceClient()

   // Fetch code with joined playlist + device count
  const { data, error } = (await supabase
    .from('codes_view')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .single()) as { data: any; error: any }

  const codeRow = data

  if (error || !codeRow) {
    return NextResponse.json({ valid: false, message: 'Invalid activation code' }, { status: 404 })
  }



  // Check expiry
  if (codeRow.expires_at && new Date(codeRow.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, message: 'Activation code has expired' }, { status: 403 })
  }

  // Check device limit
  if (codeRow.device_count >= codeRow.max_devices) {
    // Allow if this device is already registered
    const { data: existingDevice } = await supabase
      .from('devices')
      .select('id')
      .eq('android_id', android_id)
      .eq('activation_code', code)
      .single()

    if (!existingDevice) {
      return NextResponse.json({ valid: false, message: 'Device limit reached for this code' }, { status: 403 })
    }
  }

  // Register device (upsert)
  await supabase.from('devices').upsert({
    android_id,
    tv_name: tv_name || 'Unknown TV',
    activation_code: code,
    subscriber_id: codeRow.id, // links to subscriber if assigned
    last_active: new Date().toISOString(),
  }, { onConflict: 'android_id,subscriber_id' })

  return NextResponse.json({
    valid: true,
    playlist_url: codeRow.playlist_type === 'm3u'
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/playlists/${codeRow.playlist_name}.m3u`
      : null,
    // For Xtream, return the full URL stored in playlists table
    message: 'Activated successfully',
  })
}
