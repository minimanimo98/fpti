import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { token, answers } = await request.json()

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('share_token', token)
    .single()

  if (userError || !user) {
    return NextResponse.json({ error: '잘못된 링크입니다' }, { status: 404 })
  }

  const { error } = await supabase
    .from('responses')
    .insert({ user_id: user.id, answers })

  if (error) {
    return NextResponse.json({ error: '저장 실패' }, { status: 500 })
  }

  await supabase
    .from('users')
    .update({ response_count: user.response_count + 1 })
    .eq('id', user.id)

  return NextResponse.json({ success: true })
}
