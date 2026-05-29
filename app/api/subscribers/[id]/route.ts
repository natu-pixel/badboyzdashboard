import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const supabase = createServiceClient()
  const { id } = await context.params

  await (supabase.from('subscribers') as any).delete().eq('id', id)
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const supabase = createServiceClient()
  const { id } = await context.params
  const { status } = await req.json()

  await (supabase.from('subscribers') as any).update({ status }).eq('id', id)
  return NextResponse.json({ success: true })
}