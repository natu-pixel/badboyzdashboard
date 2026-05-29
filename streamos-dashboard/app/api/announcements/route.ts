import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

/**
 * GET /api/announcements?code=X82KQ
 * Android TV app polls this to show push messages.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.json({ announcements: [] })
  }

  const supabase = createServiceClient()

  // Fetch last 5 announcements targeted at 'all' or the user's plan
  const { data, error } = await supabase
    .from('announcements')
    .select('id, message, type, sent_at')
    .order('sent_at', { ascending: false })
    .limit(5)

  if (error) return NextResponse.json({ announcements: [] })

  return NextResponse.json({ announcements: data })
}
