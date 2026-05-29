import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const supabase = createServiceClient()
  const { id } = await context.params

  await (supabase.from('activation_codes') as any).delete().eq('id', id)
  return NextResponse.json({ success: true })
}