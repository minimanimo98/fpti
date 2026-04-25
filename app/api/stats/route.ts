import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { count: userCount } = await supabase
    .from('users').select('*', { count: 'exact', head: true })
  const { count: responseCount } = await supabase
    .from('responses').select('*', { count: 'exact', head: true })

  return NextResponse.json({
    users: userCount || 0,
    responses: responseCount || 0,
  })
}
